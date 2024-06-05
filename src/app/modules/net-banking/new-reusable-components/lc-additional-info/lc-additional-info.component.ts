import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { countryStateService } from "app/shared/components/reusable-pincode-popup/countrySateCityService";
import { ReusablePincodePopupComponent } from "app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component";

@Component({
  selector: "app-lc-additional-info",
  templateUrl: "./lc-additional-info.component.html",
  styleUrls: ["./lc-additional-info.component.scss"],
})
export class LcAdditionalInfoComponent implements OnInit {
  lcAdditionalInfoForm: FormGroup;
  @Input("updateParentModel") updateParentModel: (
    part: Partial<any>,
    isFormValid: boolean
  ) => void;

  @Input("tradeDetails") tradeDetails;
  countryArr: any;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cntStService: countryStateService
  ) {}

  ngOnInit(): void {
    this.getCountry();
    this.buildForm();
  }

  getCountry() {
    this.cntStService.fetchAuthCountry().subscribe((res) => {
      if (res.statusCode === 200) {
        this.countryArr = res?.data;
      }
    });
  }

  buildForm(data?) {
    this.lcAdditionalInfoForm = this.fb.group({
      lcTransfer: [data?.lcTransfer ?? "yes"],
      additionalCondition: [data?.additionalCondition ?? ""],
      bankAdvise: [data?.bankAdvise ?? ""],
      branchCode: [data?.branchCode ?? ""],
      swiftCode: [data?.swiftCode ?? ""],
      allChargesThanBankCharge: [data?.allChargesThanBankCharge ?? ""],
      remarks: [data?.remarks ?? ""],
      contactInfo: this.fb.group({
        address: this.fb.array([]),
      }),
    });

    this.updateAddress();

    this.lcAdditionalInfoForm.valueChanges.subscribe((res) => {
      this.updateParentModel(
        {
          lcAdditionalInfo: {
            ...this.lcAdditionalInfoForm.value,
            contactInfo: !this.lcAdditionalInfoForm.value.contactInfo.address[0]
              .cityId
              ? null
              : this.lcAdditionalInfoForm.value.contactInfo,
          },
        },
        this.checkForm()
      );
    });
  }

  checkForm() {
    return this.lcAdditionalInfoForm.valid;
  }

  get addressControle() {
    return this.Contact.get("address") as FormArray;
  }

  get Contact() {
    return this.lcAdditionalInfoForm.get("contactInfo") as FormGroup;
  }

  updateAddress(address?) {
    const newAddress = this.fb.group({
      address1: [address?.address1 ?? "", [Validators.required]],
      address2: [address?.address2 ?? ""],
      residenceType: [address?.residenceType ?? "", [Validators.required]],
      countryName: [address?.countryName ?? "", [Validators.required]],
      pincode: [address?.pincode ?? "", [Validators.required]],
      stateName: [address?.stateName ?? ""],
      cityId: [address?.cityId ?? ""],
      cityName: [address?.cityName ?? ""],
    });
    this.addressControle.push(newAddress);
  }

  pincodeExpansion(address) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if (res) {
        address.get("countryName").patchValue(res?.countryName);
        address.get("stateName").patchValue(res?.stateName);
        address.get("cityId").patchValue(res?.cityId);
        address.get("cityName").patchValue(res?.cityName);
        address.get("pincode").patchValue(res?.pincode);
      }
    });
  }
}
