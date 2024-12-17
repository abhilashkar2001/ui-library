import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countryStateService } from 'app/shared/components/reusable-pincode-popup/countrySateCityService';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { Router } from '@angular/router';
import { BgSummaryServiceService } from '../bg-summary/bg-summary-service.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-applicants-info',
  templateUrl: './applicants-info.component.html',
  styleUrls: ['./applicants-info.component.scss'],
})
export class ApplicantsInfoComponent implements OnInit {
  applicantForm: FormGroup | any;
  //list of country state and city
  countryArr: any[] = [];
  @Input() updateParentModel:
    | ((part: Partial<any>, isFormValid: boolean) => void)
    | any;
  feeAccArray: any[] = ['dummy Option 1', 'dummy Option 2', 'dummy Option 3'];
  @Input() tradeDetails: any;
  @Input('amendmentType') tradetype = '';
  constructor(
    private fb: FormBuilder,
    private cntStService: countryStateService,
    private dialog: MatDialog,
    private bgService: BgSummaryServiceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getStaticData();

    if (this.tradeDetails?.applicantInfo) {
      this.buildFormGroup(this.tradeDetails.applicantInfo);
    } else this.buildFormGroup();
    const id = this.router.routerState.root.snapshot.queryParams['id'];
    if (id) {
      this.fetchBgInfo(id);
    }
  }

  fetchBgInfo(id: any) {
    this.bgService
      .fetchApplicantInfo(id)
      .subscribe((res: IcHttpResponseModel<any> | any) => {
        if (res?.statusCode == 200 && res?.data?.length) {
          this.applicantForm.patchValue(res?.data[0]);
        }
      });
  }
  getStaticData() {
    this.cntStService.fetchAuthCountry().subscribe((res) => {
      if (res.statusCode === 200) {
        this.countryArr = res?.data;
      }
    });
  }
  buildFormGroup(item?: any) {
    this.applicantForm = this.fb.group({
      applicant: [item?.applicant ?? ''],
      issuingBranchCode: [item?.issuingBranchCode ?? ''],
      deliveryBranchCode: [item?.deliveryBranchCode ?? ''],
      applicantReferences: [item?.applicantReferences ?? ''],
      iecCode: [item?.iecCode ?? ''],
      deliveryMode: [item?.deliveryMode ?? ''],
      feeAccount: [item?.feeAccount ?? []],
      margin: [item?.margin ?? ''],
      customerCode: [item?.customerCode ?? ''],
      contactInfo: this.fb.group({
        address: this.fb.array([]),
      }),
    });
    this.addUserAddress(item?.contactInfo?.address[0] ?? {});
    this.applicantForm.valueChanges.subscribe((res: any) => {
      this.updateParentModel(
        {
          applicantInfo: {
            ...res,
            contactInfo: this.applicantForm.value.contactInfo,
          },
        },
        this.checkForm(),
      );
    });
  }
  checkForm() {
    return this.applicantForm.valid;
  }

  get Contact() {
    return this.applicantForm.get('contactInfo') as FormGroup;
  }
  get addressControle(): any {
    return this.Contact.get('address') as FormArray;
  }

  addUserAddress(address?: any) {
    const newAddress = this.fb.group({
      address1: [address?.address1 ?? '', [Validators.required]],
      address2: [address?.address2 ?? ''],
      residenceType: [address?.residenceType ?? '', [Validators.required]],
      countryName: [address?.countryName ?? '', [Validators.required]],
      pincode: [address?.pincode ?? '', [Validators.required]],
      stateName: [address?.stateName ?? ''],
      cityId: [address?.cityId ?? ''],
      cityName: [address?.cityName ?? ''],
    });
    this.addressControle.push(newAddress);
  }
  pincodeExpansion(formGroup: any) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: '60%',
      disableClose: true,
      panelClass: 'popup-class-approve',
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if (res) {
        formGroup.get('countryName').patchValue(res?.countryName);
        formGroup.get('stateName').patchValue(res?.stateName);
        formGroup.get('cityId').patchValue(res?.cityId);
        formGroup.get('cityName').patchValue(res?.cityName);
        formGroup.get('pincode').patchValue(res?.pincode);
      }
    });
  }
}
