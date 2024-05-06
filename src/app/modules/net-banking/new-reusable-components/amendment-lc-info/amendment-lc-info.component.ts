import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { countryStateService } from "app/shared/components/reusable-pincode-popup/countrySateCityService";
import { ReusablePincodePopupComponent } from "app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component";

@Component({
  selector: "app-amendment-lc-info",
  templateUrl: "./amendment-lc-info.component.html",
  styleUrls: ["./amendment-lc-info.component.scss"],
})
export class AmendmentLcInfoComponent implements OnInit {
  countryArr: any[] = [];
  component: string = "Amendment LC Info";
  amendmentLcInfoForm: FormGroup;
  @Input("updateParentModel") updateParentModel: (
    part: Partial<any>,
    isFormValid: boolean
  ) => void;
  constructor(
    private fb: FormBuilder,
    private cntStService: countryStateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCountrys();
    this.buildForm();
  }

  buildForm(data?) {
    this.amendmentLcInfoForm = this.fb.group({
      applicantsDetails: this.fb.group({
        lcNumber: [data?.lcNumber ?? ""],
        lcOpenDate: [data?.lcOpenDate ?? ""],
        applicant: [data?.applicant ?? ""],
        customerMode: [data?.customerMode ?? ""],
        issuingBranch: [data?.issuingBranch ?? ""],
        contactInfo: this.fb.group({
          address: this.fb.array([]),
        }),
      }),
      beneficiaryDetails: this.fb.group({
        beneficiary: [data?.beneficiary ?? ""],
        contactInfo: this.fb.group({
          address: this.fb.array([]),
        }),
      }),
      advisingBank: this.fb.group({
        bankName: [data?.bankName ?? ""],
        branch: [data?.branch ?? ""],
        swiftCode: [data?.swiftCode ?? ""],
        deliveryVia: [data?.deliveryVia ?? ""],
        contactInfo: this.fb.group({
          address: this.fb.array([]),
        }),
      }),
    });
    this.applicantAddress.push(this.buildAddressFormGroup(data?.address));
    this.beneficiaryAddress.push(this.buildAddressFormGroup(data?.address));
    this.advisingBankAddress.push(this.buildAddressFormGroup(data?.address));
    this.amendmentLcInfoForm.valueChanges.subscribe((res) => {
      let payload: any = {};
      payload = {
        lcType: "Amendment",
        lcInfo: this.amendmentLcInfoForm.value.applicantsDetails,
        beneficiary: this.amendmentLcInfoForm.value.beneficiaryDetails,
        advisingBank: this.amendmentLcInfoForm.value.advisingBank
      }
      console.log(payload);

      this.updateParentModel(
        { amendmentLcInfo: payload },
        this.checkForm()
      );
    });
  }

  buildAddressFormGroup(data?) {
    return this.fb.group({
      address1: [data?.address1 || ""],
      address2: [data?.address2 || ""],
      countryName: [data?.countryName || ""],
      pincode: [data?.pincode || ""],
      stateName: [data?.stateName || ""],
      cityId: [data?.cityId || ""],
      cityName: [data?.cityName || ""],
    });
  }

  get applicantsDetails() {
    return this.amendmentLcInfoForm.get("applicantsDetails") as FormGroup;
  }

  get applicantAddress() {
    return this.applicantsDetails
      .get("contactInfo")
      .get("address") as FormArray;
  }

  get beneficiaryDetails() {
    return this.amendmentLcInfoForm.get("beneficiaryDetails") as FormGroup;
  }

  get beneficiaryAddress() {
    return this.beneficiaryDetails
      .get("contactInfo")
      .get("address") as FormArray;
  }

  get advisingBankDetails() {
    return this.amendmentLcInfoForm.get("advisingBank") as FormGroup;
  }

  get advisingBankAddress() {
    return this.advisingBankDetails
      .get("contactInfo")
      .get("address") as FormArray;
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

  checkForm() {
    return this.amendmentLcInfoForm.valid;
  }
}
