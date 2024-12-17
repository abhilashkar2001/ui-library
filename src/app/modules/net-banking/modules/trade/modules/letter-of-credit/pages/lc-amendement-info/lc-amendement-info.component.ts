import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { countryStateService } from 'app/shared/components/reusable-pincode-popup/countrySateCityService';

@Component({
  selector: 'app-lc-amendement-info',
  templateUrl: './lc-amendement-info.component.html',
  styleUrls: ['./lc-amendement-info.component.scss'],
})
export class LcAmendementInfoComponent implements OnInit {
  lcAmendInfoForm!: FormGroup;
  @Input() updateParentModel:
    | ((part: Partial<any>, isFormValid: boolean) => void)
    | any;

  @Input() tradeDetails: any;

  isLcAmend = false;
  countryArr: any;
  componentType: any;
  constructor(
    private fb: FormBuilder,
    private cntStService: countryStateService,
    private activeRoute: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/calendar.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.activeRoute.queryParamMap.subscribe((params: any) => {
      this.componentType = params.get('type');
      this.getCountry();
      this.buildForm();
    });
  }

  getCountry() {
    this.cntStService.fetchAuthCountry().subscribe((res) => {
      if (res.statusCode === 200) {
        this.countryArr = res?.data;
      }
    });
  }

  buildForm(data?: any) {
    console.log(this.componentType, 'this.componentType');
    if (this.componentType === 'LC Amendment') {
      this.isLcAmend = true;
    } else {
      this.isLcAmend = false;
    }
    this.lcAmendInfoForm = this.fb.group({
      amendentNumber: [data?.amendentNumber ?? ''],
      lcNumber: [data?.lcNumber ?? ''],
      // common control start
      valueDate: [data?.valueDate ?? ''],
      amendReqDate: [data?.amendReqDate ?? ''],
      changeOfExpiry: [data?.changeOfExpiry ?? ''],
      amountChange: [data?.amountChange ?? ''],
      // common control end
      ...(this.isLcAmend
        ? {
            // for lc amend
            expDateChangeFrom: [data?.expDateChangeFrom ?? ''],
            expDateChangeTo: [data?.expDateChangeTo ?? ''],
            latestDtOfShipment: [data?.latestDtOfShipment ?? ''],
            lastDtOfShipmentFrom: [data?.lastDtOfShipmentFrom ?? ''],
            newPlcOfExpiry: [data?.newPlcOfExpiry ?? ''],
            currPlcOfExpiry: [data?.currPlcOfExpiry ?? ''],
            creditInfo: this.fb.group({
              credit: this.fb.array([]),
            }),
          }
        : {
            // for lc physical amend start
            oldExpiryDate: [data?.oldExpiryDate ?? ''],
            newExpiryDate: [data?.newExpiryDate ?? ''],
            oldLastDateShipment: [data?.oldLastDateShipment ?? ''],
            newLastDateShipment: [data?.newLastDateShipment ?? ''],
            current: [data?.current ?? ''],
            amount: [data?.amount ?? ''],
            increaseDecreaseAmount: [data?.increaseDecreaseAmount ?? ''],
            newCurrent: [data?.newCurrent ?? ''],
            newAmount: [data?.newAmount ?? ''],
            comment: [data?.comment ?? ''],
            accountList: [data?.comment ?? []],
          }),
    });

    this.updateCredit();

    this.lcAmendInfoForm.valueChanges.subscribe(() => {
      let payload: any = {};
      payload = {
        lcType: 'Amendment',
        amendmentInfo: this.lcAmendInfoForm.value,
      };
      this.updateParentModel(
        {
          lcAmendmentAmendmentInfo: {
            payload,
          },
        },
        this.checkForm(),
      );
    });
  }

  checkForm() {
    return this.lcAmendInfoForm.valid;
  }

  get creditControle(): any {
    return this.Credit.get('credit') as FormArray;
  }

  get Credit() {
    return this.lcAmendInfoForm.get('creditInfo') as FormGroup;
  }

  updateCredit(data?: any) {
    const newAddress = this.fb.group({
      title: [data?.title ?? '', [Validators.required]],
      currency: [data?.currency ?? ''],
      creditAmount: [data?.creditAmount ?? '', [Validators.required]],
      maxCreditAmount: [data?.maxCreditAmount ?? '', [Validators.required]],
    });
    this.creditControle.push(newAddress);
  }

  removeCreditControl(index: number) {
    this.creditControle.removeAt(index);
  }
}
