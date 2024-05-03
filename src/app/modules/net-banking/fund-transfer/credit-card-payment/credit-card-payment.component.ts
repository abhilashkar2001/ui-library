import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  RequiredValidator,
  Validators,
} from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

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
  selectList = [{ label: "10000", value: "10000" }];
  aanList = [{ label: "10000", value: "10000" }];

  constructor(
    private formBuilder: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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
  }
  buildCreditCardForm() {
    this.creditCardForm = this.formBuilder.group({
      debitAccountNo: ["", Validators.required],
      aanNo: ["", Validators.required],
      amount: ["", Validators.required],
      transferOn: ["", Validators.required],
      remitter: [false],
      remitterEmail: [""],
      remitterMobile: [""],
      narration: [false],
      remitterNarration: [""],
    });
  }
}
