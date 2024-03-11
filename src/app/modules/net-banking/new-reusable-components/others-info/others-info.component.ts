import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { countryStateService } from "app/shared/components/reusable-pincode-popup/countrySateCityService";
import { ReusablePincodePopupComponent } from "app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component";

@Component({
  selector: "app-others-info",
  templateUrl: "./others-info.component.html",
  styleUrls: ["./others-info.component.scss"],
})
export class OthersInfoComponent implements OnInit {
  @Input("bgType") bgType; // 'BG Issuance' - Dynamically both names it should be work
  @Input("updateParentModel") updateParentModel: (
    part: Partial<any>,
    isFormValid: boolean
  ) => void;
  otherInfoForm: FormGroup;
  countries: any;
  constructor(
    private fb: FormBuilder,
    private countryService: countryStateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllCountry();
    this.buildOtherInfoForm({});
  }

  buildOtherInfoForm(item) {
    this.otherInfoForm = this.fb.group({
      specifyCounterGuarantee: [
        item.specifyCounterGuarantee ? item.specifyCounterGuarantee : "",
      ],
      swiftCode: [item.swiftCode ? item.swiftCode : ""],
      bankName: [item.bankName ? item.bankName : ""],

      contactInfo: this.fb.group({
        address: this.fb.array([
          this.fb.group({
            address1: [
              item.contact?.address[0]?.address1
                ? item.contact?.address[0]?.address1
                : "",
              Validators.required,
            ],
            address2: [
              item.contact?.address[0]?.address2
                ? item.contact?.address[0]?.address2
                : "",
            ],
            countryName: [
              item.contact?.address[0]?.countryName
                ? item.contact?.address[0]?.countryName
                : "",
              Validators.required,
            ],
            pincode: [
              item.contact?.address[0]?.pincode
                ? item.contact?.address[0]?.pincode
                : "",
              Validators.required,
            ],
            stateName: [
              item.contact?.address[0]?.stateName
                ? item.contact?.address[0]?.stateName
                : "",
              Validators.required,
            ],
            cityName: [
              item.contact?.address[0]?.cityName
                ? item.contact?.address[0]?.cityName
                : "",
              Validators.required,
            ],
            cityId: [
              item?.contact?.address[0]?.cityId ?? "",
              [Validators.required],
            ],
          }),
        ]),
      }),
      ...(this.bgType === "BG Issuance"
        ? {
          textualDescription: [
            item.textualDescription ? item.textualDescription : "",
          ],
          introToBank: [item.introToBank ? item.introToBank : ""],
        }
        : {
          counterGuarantee: [
            item.counterGuarantee ? item.counterGuarantee : "",
          ],
          deliveryMode: [item.deliveryMode ? item.deliveryMode : ""],
          deliveryBranch: [item.deliveryBranch ? item.deliveryBranch : ""],
          margin: [item.margin ? item.margin : ""],
          feeAccount: [item.feeAccount ? item.feeAccount : ""],
        }),
      branchName: [item.branchName ? item.branchName : ""],
      deliveryInstruction: [
        item.deliveryInstruction ? item.deliveryInstruction : "",
      ],
    });
    this.otherInfoForm.valueChanges.subscribe((res) => {
      this.updateParentModel(
        { otherInfoModel: this.otherInfoForm.value, contactInfo: !this.otherInfoForm.value.contactInfo.address[0].cityId ? null : this.otherInfoForm.value.contactInfo },
        this.checkform()
      );
    });
  }
  checkform() {
    return this.otherInfoForm.valid;
  }

  get addressControl(): FormArray {
    return this.Contact.get("address") as FormArray;
  }

  get Contact() {
    return this.otherInfoForm.get("contactInfo") as FormGroup;
  }

  getAllCountry() {
    this.countryService.getAllCountry().subscribe((resp) => {
      this.countries = resp?.data;
    });
  }

  populatePincodeData(i) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addressControl.at(i).patchValue(res);
      }
    });
  }
}
