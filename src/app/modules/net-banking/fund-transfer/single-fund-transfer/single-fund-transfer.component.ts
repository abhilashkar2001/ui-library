import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { SessionService } from "app/shared/session.service";
import { FundTransferService } from "../fund-transfer.service";
import { Router } from "@angular/router";

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
  custAccounts: any;
  constructor(
    private fb: FormBuilder,
    private fundTransferService: FundTransferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.custAccounts = JSON.parse(sessionStorage.getItem("listOfAccounts"));
    this.custAccounts.forEach((element) => {
      this.fromAccount.push(element.accountNo);
    });
    this.fetchBenificiary();
    this.fetchGeneric();
    this.buildForm();
  }

  buildForm() {
    this.fundTransferForm = this.fb.group({
      purposeOfPayment: ["", Validators.required],
      debitAccount: ["", Validators.required],
      amount: ["", Validators.required],
      transferMode: [""],
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

  fetchBenificiary() {
    this.fundTransferService.fetchBenificiary().subscribe((resp: any) => {
      if (resp?.statusCode == 200) {
        this.transferTo = resp?.data;
      }
    });
  }

  fetchGeneric() {
    this.fundTransferService
      .fetchGeneric("Common", "TRANSFERMODE")
      .subscribe((resp: any) => {
        this.transferMode = resp?.data?.TRANSFERMODE;
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

  cancel() {
    this.router.navigate(["user/dashboard/home"]);
  }

  clear() {
    this.fundTransferForm.reset();
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
