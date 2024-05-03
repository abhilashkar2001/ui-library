import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  RequiredValidator,
  Validators,
} from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { FundTransferService } from "../fund-transfer.service";

@Component({
  selector: "app-credit-card-payment",
  templateUrl: "./credit-card-payment.component.html",
  styleUrls: ["./credit-card-payment.component.scss"],
})
export class CreditCardPaymentComponent implements OnInit {
  today = new Date();
  showSendAdviceBlock: boolean = false;
  showNarrationBlock: boolean = false;
  creditCardForm: FormGroup;
  selectList = [];
  aanList = [
    { label: "000037560058", value: "000037560058" },
    { label: "000037560078", value: "000037560078" },
    { label: "000037560069", value: "000037560069" },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private fundTransferService: FundTransferService
  ) {
    this.matIconRegistry.addSvgIcon(
      `card-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/card_payment.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/calendar.svg"
      )
    );
  }

  ngOnInit(): void {
    this.buildCreditCardForm();
    // Subscribe to value changes of the remitter checkbox
    this.creditCardForm.get("remitter").valueChanges.subscribe((value) => {
      this.showSendAdviceBlock = value;
    });
    this.creditCardForm.get("narration").valueChanges.subscribe((value) => {
      this.showNarrationBlock = value;
    });
    this.fetchCustomerInfo();
  }
  buildCreditCardForm() {
    this.creditCardForm = this.formBuilder.group({
      debitAccount: ["", Validators.required],
      debitAmount: ["", Validators.required],
      transferOn: ["", Validators.required],
      remitter: [false],
      remitterEmail: [""],
      remitterMobile: [""],
      narration: [false],
      remitterNarration: [""],
      creditAmount: [""],
      creditAccount: ["", [Validators.required]],
    });
  }

  fetchCustomerInfo() {
    this.selectList = JSON.parse(sessionStorage.getItem("listOfAccounts"));
  }

  submit() {
    let payload = { ...this.creditCardForm.value };
    payload.creditAmount = payload.debitAmount;
    this.fundTransferService.saveCreditCard(payload).subscribe((res) => {});
  }
}
