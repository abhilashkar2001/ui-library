import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { Router } from '@angular/router';
import { BgSummaryServiceService } from '../../../shared-trade/bg-summary/bg-summary-service.service';

@Component({
  selector: 'app-bg-info',
  templateUrl: './bg-info.component.html',
  styleUrls: ['./bg-info.component.scss'],
})
export class BgInfoComponent implements OnInit {
  @Input() componentName: any;
  @Input() bgType: any;
  @Input() updateParentModel:
    | ((part: Partial<any>, isFormValid: boolean) => void)
    | any;

  @Input() tradeDetails: any;
  bgIssuanceForm!: FormGroup;
  benificiaryDetailsForm!: FormGroup<any>;
  bgIssuanceBgInfoForm!: FormGroup<any>;
  constructor(
    private fb: FormBuilder,
    private bgService: BgSummaryServiceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.tradeDetails?.benificiaryDetails) {
      this.buildFormGroup({ ...this.tradeDetails });
    } else {
      this.buildFormGroup({});
    }

    const id = this.router.routerState.root.snapshot.queryParams['id'];
    if (id) this.fetchBgInfo(id);
  }

  fetchBgInfo(bgMasterId: number) {
    this.bgService
      .fetchBgInfo(bgMasterId)
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode === 200 && res?.data) {
          this.bgIssuanceForm.get('bgIssuanceBgInfo')?.patchValue(res?.data[0]);
          this.bgIssuanceForm
            .get('benificiaryDetails')
            ?.patchValue(res?.data[0]);
          this.bgIssuanceForm
            .get('transactionInfoDetails')
            ?.patchValue(res?.data[0]);
          this.bgIssuanceForm
            .get('bgAmendBgInfoDetails')
            ?.patchValue(res?.data[0]);
        }
      });
  }

  buildFormGroup(data?: any) {
    this.bgIssuanceForm = this.fb.group({
      bgIssuanceBgInfo: this.bgIssuanceInfoFormGroup(data),
      benificiaryDetails: this.benificiaryFormGroup(data),
      transactionInfoDetails: this.transactionInfoFormGroup(),
      bgAmendBgInfoDetails: this.bgAmendInfoFormGroup(data),
    });
    this.addressControle.push(
      this.addUserAddress(
        data?.benificiaryDetails?.contactInfo?.address[0] ?? {},
      ),
    );
    this.bgAmendAddress.push(
      this.addUserAddress(
        data?.benificiaryDetails?.contactInfo?.address[0] ?? {},
      ),
    );
    this.bgIssuanceForm.valueChanges.subscribe(() => {
      let payload: any = {};
      if (this.bgType === 'BG Issuance') {
        payload = {
          ...this.bgIssuanceForm.value.bgIssuanceBgInfo,
          ...this.bgIssuanceForm.value.benificiaryDetails,
          contactInfo: !this.bgIssuanceForm.value.benificiaryDetails.contactInfo
            .address[0].cityId
            ? null
            : this.bgIssuanceForm.value.benificiaryDetails.contactInfo,
        };

        this.updateParentModel(
          { benificiaryDetails: payload },
          this.checkForm(),
        );
      } else {
        payload = {
          ...this.bgIssuanceForm.value.bgAmendBgInfoDetails,
          ...this.bgIssuanceForm.value.benificiaryDetails,
          ...this.bgIssuanceForm.value.transactionInfoDetails,
        };
        this.updateParentModel(
          { benificiaryDetails: payload },
          this.checkForm(),
        );
        // for bg amendement
      }
    });
  }

  bgIssuanceInfoFormGroup(data?: any) {
    return this.fb.group({
      // Define child form controls
      valueDate: [
        data?.benificiaryDetails ? data?.benificiaryDetails.valueDate : '',
      ],
      requestDate: [
        data?.benificiaryDetails ? data?.benificiaryDetails.requestDate : '',
      ],
      effectiveDate: [
        data?.benificiaryDetails ? data?.benificiaryDetails.effectiveDate : '',
      ],
      isDomesticBg: [true],
      category: [
        data?.benificiaryDetails ? data?.benificiaryDetails.category : '',
      ],
      currencyCode: [
        data?.benificiaryDetails ? data?.benificiaryDetails.currencyCode : '',
      ],
      amount: [
        data?.benificiaryDetails?.amount ? data?.benificiaryDetails.amount : '',
      ],
      dueDate: [
        data?.benificiaryDetails ? data?.benificiaryDetails.dueDate : '',
      ],
      bgTenureInDays: [
        data?.benificiaryDetails ? data?.benificiaryDetails.bgTenureInDays : '',
      ],
      claimPeriod: [
        data?.benificiaryDetails ? data?.benificiaryDetails.claimPeriod : '',
      ],
      expiryDateIncClaimPeriod: [
        data?.benificiaryDetails
          ? data?.benificiaryDetails.expiryDateIncClaimPeriod
          : '',
      ],
    });
  }

  benificiaryFormGroup(data?: any) {
    return this.fb.group({
      beneficiary: ['', Validators.required],
      ...(this.bgType === 'BG Issuance'
        ? {
            purpose: [
              data?.benificiaryDetails ? data?.benificiaryDetails.purpose : '',
            ],
          }
        : {
            email: [
              '',
              Validators.pattern(
                '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
              ),
            ],
            notifyBenificary: [true],
          }),
      contactInfo: this.fb.group({
        address: this.fb.array([]),
      }),
    });
  }

  transactionInfoFormGroup() {
    return this.fb.group({
      openDate: ['', Validators.required],
      bgEffectiveDate: [''],
      type: ['', Validators.required],
      category: ['', Validators.required],
      amount: [''],
      purpose: [''],
    });
  }

  bgAmendInfoFormGroup(data?: any) {
    return this.fb.group({
      bgNumber: [
        data?.benificiaryDetails ? data?.benificiaryDetails?.bgNumber : '',
      ],
      applicant: [
        data?.benificiaryDetails ? data?.benificiaryDetails?.applicant : '',
      ],
      customerCode: [
        data?.benificiaryDetails ? data?.benificiaryDetails?.customerCode : '',
      ],
      contactInfo: this.fb.group({
        address: this.fb.array([]),
      }),
    });
  }

  checkForm() {
    return this.bgIssuanceForm.valid;
  }

  addUserAddress(address?: any) {
    return this.fb.group({
      address1: [address?.address1 ?? '', [Validators.required]],
      address2: [address?.address2 ?? ''],
      residenceType: [address?.residenceType ?? '', [Validators.required]],
      countryName: [address?.countryName ?? '', [Validators.required]],
      pincode: [address?.pincode ?? '', [Validators.required]],
      stateName: [address?.stateName ?? ''],
      cityId: [address?.cityId ?? ''],
      cityName: [address?.cityName ?? ''],
    });
  }

  get addressControle() {
    return this.Contact.get('address') as FormArray;
  }
  get Contact() {
    return this.bgIssuanceForm
      .get('benificiaryDetails')
      ?.get('contactInfo') as FormGroup;
  }

  get bgAmendAddress() {
    return this.bgAmendContact.get('address') as FormArray;
  }
  get bgAmendContact() {
    return this.bgIssuanceForm
      .get('bgAmendBgInfoDetails')
      ?.get('contactInfo') as FormGroup;
  }
}
