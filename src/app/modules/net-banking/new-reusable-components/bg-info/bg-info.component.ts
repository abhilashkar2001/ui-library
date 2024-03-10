import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-bg-info",
  templateUrl: "./bg-info.component.html",
  styleUrls: ["./bg-info.component.scss"],
})
export class BgInfoComponent implements OnInit {
  @Input() componentName;
  @Input("bgType") bgType;
  @Input("updateParentModel") updateParentModel: (
    part: Partial<any>,
    isFormValid: boolean
  ) => void;
  bgIssuanceForm: FormGroup;
  benificiaryDetailsForm: FormGroup<any>;
  bgIssuanceBgInfoForm: FormGroup<any>;
  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    console.log(this.bgType, "type");
  }

  ngOnInit(): void {
    this.buildFormGroup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, "changein bg");
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  buildFormGroup() {
    this.bgIssuanceForm = this.fb.group({
      bgIssuanceBgInfo: this.fb.group({
        // Define child form controls
        valueDate: [""],
        requestDate: [""],
        effectiveDate: [""],
        isDomesticBg: [true],
        category: [""],
        currencyCode: [""],
        amount: [""],
        dueDate: [""],
        bgTenureInDays: [""],
        claimPeriod: [""],
        expiryDateIncClaimPeriod: [""],
      }),

      benificiaryDetails: this.fb.group({
        beneficiary: ["", Validators.required],
        ...(this.bgType === "BG Issuance"
          ? {
              purpose: [""],
            }
          : {
              email: [
                "",
                Validators.pattern(
                  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
                ),
              ],
              notifyBenificary: [true],
            }),
        contactInfo: this.fb.group({
          address: this.fb.array([]),
        }),
      }),
      transactionInfoDetails: this.fb.group({
        openDate: ["", Validators.required],
        bgEffectiveDate: [""],
        type: ["", Validators.required],
        category: ["", Validators.required],
        amount: [""],
        purpose: [""],
      }),
      bgAmendBgInfoDetails: this.fb.group({
        bgNumber: [""],
        applicant: [""],
        customerCode: [""],
        contactInfo: this.fb.group({
          address: this.fb.array([]),
        }),
      }),
    });
    this.addressControle.push(this.addUserAddress());
    this.bgAmendAddress.push(this.addUserAddress());
    this.bgIssuanceForm.valueChanges.subscribe((res) => {
      let payload: any = {};
      if (this.bgType === "BG Issuance") {
        payload = {
          ...this.bgIssuanceForm.value.bgIssuanceBgInfo,
          ...this.bgIssuanceForm.value.benificiaryDetails,
        };

        this.updateParentModel(
          { benificiaryDetails: payload },
          this.checkForm()
        );
      } else {
        payload = {
          ...this.bgIssuanceForm.value.bgAmendBgInfoDetails,
          ...this.bgIssuanceForm.value.benificiaryDetails,
          ...this.bgIssuanceForm.value.transactionInfoDetails,
        };
        this.updateParentModel(
          { benificiaryDetails: payload },
          this.checkForm()
        );
        // for bg amendement
      }
    });
  }

  checkForm() {
    return this.bgIssuanceForm.valid;
  }

  addUserAddress(address?) {
    return this.fb.group({
      address1: [address?.address1 ?? "", [Validators.required]],
      address2: [address?.address2 ?? ""],
      residenceType: [address?.residenceType ?? "", [Validators.required]],
      countryName: [address?.countryName ?? "", [Validators.required]],
      pincode: [address?.pincode ?? "", [Validators.required]],
      stateName: [address?.stateName ?? ""],
      cityId: [address?.cityId ?? ""],
      cityName: [address?.cityName ?? ""],
    });
  }

  get addressControle() {
    return this.Contact.get("address") as FormArray;
  }
  get Contact() {
    return this.bgIssuanceForm
      .get("benificiaryDetails")
      .get("contactInfo") as FormGroup;
  }

  get bgAmendAddress() {
    return this.bgAmendContact.get("address") as FormArray;
  }
  get bgAmendContact() {
    return this.bgIssuanceForm
      .get("bgAmendBgInfoDetails")
      .get("contactInfo") as FormGroup;
  }
}
