import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { countryStateService } from "app/shared/components/reusable-pincode-popup/countrySateCityService";
import { ReusablePincodePopupComponent } from "app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component";

@Component({
  selector: "app-applicants-info",
  templateUrl: "./applicants-info.component.html",
  styleUrls: ["./applicants-info.component.scss"],
})
export class ApplicantsInfoComponent implements OnInit {
  applicantForm: FormGroup;
  //list of country state and city
  countryArr: any[] = [];
  @Input("updateParentModel") updateParentModel: (
    part: Partial<any>,
    isFormValid: boolean
  ) => void;
  feeAccArray: any[] = ["dummy Option 1", "dummy Option 2"];
  @Input("tradeDetails") tradeDetails;
  constructor(
    private fb: FormBuilder,
    private cntStService: countryStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getStaticData();
    if (this.tradeDetails?.applicantInfo) {
      this.buildFormGroup(this.tradeDetails.applicantInfo);
    } else this.buildFormGroup();
  }
  getStaticData() {
    this.cntStService.fetchAuthCountry().subscribe((res) => {
      if (res.statusCode === 200) {
        this.countryArr = res?.data;
      }
    });
  }
  buildFormGroup(item?) {
    this.applicantForm = this.fb.group({
      applicant: [item?.applicant ?? ""],
      issuingBranchCode: [item?.issuingBranchCode ?? ""],
      deliveryBranchCode: [item?.deliveryBranchCode ?? ""],
      applicantReferences: [item?.applicantReferences ?? ""],
      deliveryMode: [item?.deliveryMode ?? ""],
      feeAccount: [item?.feeAccount ?? []],
      contactInfo: this.fb.group({
        address: this.fb.array([]),
      }),
    });
    this.addUserAddress(item?.contactInfo?.address[0] ?? {});
    this.applicantForm.valueChanges.subscribe((res) => {
      this.updateParentModel(
        {
          applicantInfo: {
            ...res,
            contactInfo: !this.applicantForm.value.contactInfo.address[0].cityId
              ? null
              : this.applicantForm.value.contactInfo,
          },
        },
        this.checkForm()
      );
    });
  }
  checkForm() {
    return this.applicantForm.valid;
  }

  get Contact() {
    return this.applicantForm.get("contactInfo") as FormGroup;
  }
  get addressControle() {
    return this.Contact.get("address") as FormArray;
  }

  addUserAddress(address?) {
    const newAddress = this.fb.group({
      // addressId: [address?.addressId ?? null],
      address1: [address?.address1 ?? "", [Validators.required]],
      address2: [address?.address2 ?? ""],
      // addressType: [
      //   address?.addressType ?? this.addressControle.length == 0
      //     ? "Communication"
      //     : "Permanent",
      // ],
      residenceType: [address?.residenceType ?? "", [Validators.required]],
      countryName: [address?.countryName ?? "", [Validators.required]],
      pincode: [address?.pincode ?? "", [Validators.required]],
      stateName: [address?.stateName ?? ""],
      cityId: [address?.cityId ?? ""],
      cityName: [address?.cityName ?? ""],
    });
    this.addressControle.push(newAddress);
  }
  pincodeExpansion(index, formGroup) {
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
