import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { countryStateService } from "app/shared/components/reusable-pincode-popup/countrySateCityService";
import { ReusablePincodePopupComponent } from "app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component";

@Component({
  selector: "app-lc-info",
  templateUrl: "./lc-info.component.html",
  styleUrls: ["./lc-info.component.scss"],
})
export class LcInfoComponent implements OnInit {
  lcInfoForm: FormGroup;
  countryArr: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cntStService: countryStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCountrys();
    this.buildForm();
  }

  buildForm(data?) {
    this.lcInfoForm = this.fb.group({
      type: [data?.type ?? ""],
      domesticOrForegin: [data?.domesticOrForegin ?? "domesticLC"],
      redClause: [data?.redClause ?? false],
      revolving: [data?.revolving ?? false],
      currency: [data?.currency ?? "", [Validators.required]],
      amount: [data?.amount ?? ""],
      tolerance: [data?.tolerance ?? "", [Validators.required]],
      additionalAmounts: [data?.additionalAmounts ?? ""],
      valueDate: [data?.valueDate ?? "", [Validators.required]],
      requestDate: [data?.requestDate ?? "", [Validators.required]],
      purpose: [data?.purpose ?? "", [Validators.required]],
      placeOfExpiry: [data?.placeOfExpiry ?? "", [Validators.required]],
      expiryDate: [data?.expiryDate ?? "", [Validators.required]],
      creditAvailable: [data?.creditAvailable ?? "", [Validators.required]],
      by: [data?.by ?? ""],
      defferedPaymentDetails: [data?.defferedPaymentDetails ?? ""],
      invoiceValue: [data?.invoiceValue ?? ""],
      tenorDays: [data?.tenorDays ?? "", [Validators.required]],
      tenor: [data?.tenor ?? "", [Validators.required]],
      bankDetails: this.fb.group({
        advisingBank: [data?.advisingBank ?? ""],
        branch: [data?.branch ?? ""],
        swiftCode: [data?.swiftCode ?? ""],
        confirmationOfCredit: [data?.confirmationOfCredit ?? false],
        drawee: [data?.drawee ?? ""],
        address: this.fb.array([
          this.fb.group({
            address1: [data?.address?.address1 ?? "", [Validators.required]],
            address2: [data?.address?.address2 ?? ""],
            countryName: [data?.address?.countryName ?? ""],
            pincode: [data?.address?.pincode ?? ""],
            stateName: [data?.address?.stateName ?? ""],
            cityId: [data?.address?.cityId ?? ""],
            cityName: [data?.address?.cityName ?? ""],
          }),
        ]),
      }),
      beneficiaryDetails: this.fb.group({
        beneficiary: [data?.beneficiary ?? ""],
        address: this.fb.array([
          this.fb.group({
            address1: [data?.address?.address1 ?? ""],
            address2: [data?.address?.address2 ?? ""],
            countryName: [data?.address?.countryName ?? ""],
            pincode: [data?.address?.pincode ?? ""],
            stateName: [data?.address?.stateName ?? ""],
            cityId: [data?.address?.cityId ?? ""],
            cityName: [data?.address?.cityName ?? ""],
          }),
        ]),
      }),
    });
  }

  get bankDetails() {
    return this.lcInfoForm.get("bankDetails") as FormGroup;
  }

  get bankAddressControl() {
    return this.bankDetails.get("address") as FormArray;
  }

  get beneficiaryDetails() {
    return this.lcInfoForm.get("beneficiaryDetails") as FormGroup;
  }

  get beneficiaryAddressControl() {
    return this.beneficiaryDetails.get("address") as FormArray;
  }

  checkForm() {
    console.log(this.lcInfoForm.value);
    return this.lcInfoForm.valid;
  }

  getCountrys() {
    this.cntStService.fetchAuthCountry().subscribe((res) => {
      if (res.statusCode === 200) {
        this.countryArr = res?.data;
      }
    });
  }

  pincodeExpansion(formGroup) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if (res) {
        formGroup.get("countryName").patchValue(res?.countryName);
        formGroup.get("stateName").patchValue(res?.stateName);
        formGroup.get("cityId").patchValue(res?.cityId);
        formGroup.get("cityName").patchValue(res?.cityName);
        formGroup.get("pincode").patchValue(res?.pincode);
      }
    });
  }
}
