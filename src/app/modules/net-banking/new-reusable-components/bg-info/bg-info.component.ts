import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-bg-info",
  templateUrl: "./bg-info.component.html",
  styleUrls: ["./bg-info.component.scss"],
})
export class BgInfoComponent implements OnInit {
  @Input() componentName = "BG Issuance";
  @Input("updateParentModel") updateParentModel: (
    part: Partial<any>,
    isFormValid: boolean
  ) => void;
  bgIssuanceForm: FormGroup;
  benificiaryDetailsForm: FormGroup<any>;
  bgIssuanceBgInfoForm: FormGroup<any>;
  constructor(private fb: FormBuilder) {
    this.buildFormGroup();
  }

  ngOnInit(): void {}

  buildFormGroup() {
    this.bgIssuanceForm = this.fb.group({
      bgIssuanceBgInfo: this.fb.group({
        // Define child form controls
        valueDate: [""],
        requestDate: [""],
        effectiveDate: [""],
        type: ["Domestic BG"],
        category: [""],
        currency: [""],
        amount: [""],
        expiryDate: [""],
        bgInsurance: [""],
        claimPeriod: [""],
        claimPeriodExpiryDate: [""],
      }),

      benificiaryDetails: this.fb.group({
        // Define child form controls
        beneficiary: ["", Validators.required],
        address1: ["", Validators.required],
        address2: [""],
        country: ["", Validators.required],
        state: ["", Validators.required],
        city: ["", Validators.required],
        pincode: ["", Validators.required],
        email: [
          "",
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
          ),
        ],
        notifyBenificary: [true],
        purpose: [""],
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
        address1: ["", Validators.required],
        address2: [""],
        city: ["", Validators.required],
        pincode: ["", Validators.required],
        country: ["", Validators.required],
        state: ["", Validators.required],
      }),
    });

    this.bgIssuanceForm.valueChanges.subscribe((res)=>{
      this.updateParentModel(res , this.checkForm());
    })
  }

  checkForm(){
    return this.bgIssuanceForm.valid;
  }
}
