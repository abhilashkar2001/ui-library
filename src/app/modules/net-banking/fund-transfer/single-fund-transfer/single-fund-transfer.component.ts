import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { SessionService } from "app/shared/session.service";
import { FundTransferService } from "../fund-transfer.service";

@Component({
  selector: "app-single-fund-transfer",
  templateUrl: "./single-fund-transfer.component.html",
  styleUrls: ["./single-fund-transfer.component.scss"],
})
export class SingleFundTransferComponent implements OnInit {
  fundTransferForm: FormGroup;
  purpose = ["Salary", "Vendor"];
  fromAccount = [];
  transferMode = [];
  transferTo = [];
  benificiaryEmail = [];
  benificiaryMobile = [];
  remitter: boolean = false;
  beneficiary: boolean = false;
  beneficiaryNarration: boolean = false;
  remitterNarration: boolean = false;
  paymentDetail: boolean = false;
  constructor(
    private fb: FormBuilder,
    private fundTransferService: FundTransferService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.fundTransferForm = this.fb.group({
      purposeOfPayment: ["", Validators.required],
      debitAccount: ["", Validators.required],
      amount: ["", Validators.required],
      transferMode: ["", Validators.required],
      creditAccount: ["", Validators.required],
      trransferOn: ["", Validators.required],
      remmitterEmail: [""],
      remmitterMobile: [""],
      benificiaryEmail: [""],
      benificiaryMobile: [""],
      remmitterNarration: [""],
      benificiaryNarration: [""],
      detail1: [""],
      detail2: [""],
      detail3: [""],
      remarks: [""],
    });
  }

  onCheckBox(checkbox: string, event: MatCheckboxChange) {
    if (event.checked) {
      if (checkbox === "Remitter") this.remitter = true;
      else if (checkbox === "Beneficiary") this.beneficiary = true;
      else if (checkbox === "RemitterNarration") this.remitterNarration = true;
      else if (checkbox === "BeneficiaryNarration")
        this.beneficiaryNarration = true;
      else if (checkbox === "paymentDetail") this.paymentDetail = true;
    } else {
      if (checkbox === "Remitter") this.remitter = false;
      else if (checkbox === "Beneficiary") this.beneficiary = false;
      else if (checkbox === "RemitterNarration") this.remitterNarration = false;
      else if (checkbox === "BeneficiaryNarration")
        this.beneficiaryNarration = false;
      else if (checkbox === "paymentDetail") this.paymentDetail = false;
    }
  }

  sabmit() {
    if (!this.fundTransferForm.valid) return;
    let payload = [];
    payload.push(this.fundTransferForm.value);
    this.fundTransferService
      .saveFundTransferData(payload)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
        }
      });
  }
}
