import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { countryStateService } from "app/shared/components/reusable-pincode-popup/countrySateCityService";

@Component({
  selector: "app-lc-amendement-info",
  templateUrl: "./lc-amendement-info.component.html",
  styleUrls: ["./lc-amendement-info.component.scss"],
})
export class LcAmendementInfoComponent implements OnInit {
  lcAmendInfoForm: FormGroup;
  @Input("updateParentModel") updateParentModel: (
    part: Partial<any>,
    isFormValid: boolean
  ) => void;

  @Input("tradeDetails") tradeDetails;

  isLcAmend: boolean = false;
  countryArr: any;
  componentType: any;
  constructor(
    private fb: FormBuilder,
    private cntStService: countryStateService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activeRoute.queryParamMap.subscribe((params: any) => {
      this.componentType = params.get("type");
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

  buildForm(data?) {
    console.log(this.componentType, "this.componentType");
    this.lcAmendInfoForm = this.fb.group({
      amendentNumber: [data?.amendentNumber ?? ""],

      lcNumber: [data?.lcNumber ?? ""],
      // common control start
      valueDate: [data?.valueDate ?? ""],
      amendRequestDate: [data?.amendRequestDate ?? ""],
      changeOfExpiry: [data?.changeOfExpiry ?? ""],
      amountChange: [data?.amountChange ?? ""],
      // common control end
      // ...(this.componentType == "LC Physical Amendment "
      ...(this.isLcAmend
        ? {
            // for lc amend
            expiryDateChangeFrom: [data?.expiryDateChangeFrom ?? ""],
            expiryDateChange: [data?.expiryDateChange ?? ""],
            latestDateOfShipment: [data?.latestDateOfShipment ?? ""],
            lastLastDateShipment: [data?.lastLastDateShipment ?? ""],
            newPlaceOfExpiry: [data?.newPlaceOfExpiry ?? ""],
            currentPlaceOfExpiry: [data?.currentPlaceOfExpiry ?? ""],
          }
        : {
            // for lc physical amend start
            oldExpiryDate: [data?.oldExpiryDate ?? ""],
            newExpiryDate: [data?.newExpiryDate ?? ""],
            oldLastDateShipment: [data?.oldLastDateShipment ?? ""],
            newLastDateShipment: [data?.newLastDateShipment ?? ""],
            current: [data?.current ?? ""],
            amount: [data?.amount ?? ""],
            increaseDecreaseAmount: [data?.increaseDecreaseAmount ?? ""],
            newCurrent: [data?.newCurrent ?? ""],
            newAmount: [data?.newAmount ?? ""],
            comment: [data?.comment ?? ""],
            accountList: [data?.comment ?? []],

            creditInfo: this.fb.group({
              credit: this.fb.array([]),
            }),
          }),
    });

    this.updateCredit();

    this.lcAmendInfoForm.valueChanges.subscribe((res) => {
      this.updateParentModel(
        {
          lcAdditionalInfo: {
            ...this.lcAmendInfoForm.value,
          },
        },
        this.checkForm()
      );
    });
  }

  checkForm() {
    return this.lcAmendInfoForm.valid;
  }

  get creditControle() {
    return this.Credit.get("credit") as FormArray;
  }

  get Credit() {
    return this.lcAmendInfoForm.get("creditInfo") as FormGroup;
  }

  updateCredit(data?) {
    const newAddress = this.fb.group({
      title: [data?.title ?? "", [Validators.required]],
      currency: [data?.currency ?? ""],
      creditAmount: [data?.creditAmount ?? "", [Validators.required]],
      maxCreditAmount: [data?.maxCreditAmount ?? "", [Validators.required]],
    });
    this.creditControle.push(newAddress);
  }

  removeCreditControl(index: number) {
    this.creditControle.removeAt(index);
  }
}
