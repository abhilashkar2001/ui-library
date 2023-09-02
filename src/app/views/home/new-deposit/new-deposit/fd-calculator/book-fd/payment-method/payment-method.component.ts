import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SuccessPopupComponent } from "../../success-popup/success-popup.component";
import { FdCalculatorServiceService } from "../../fd-calculator-service.service";

@Component({
  selector: "app-payment-method",
  templateUrl: "./payment-method.component.html",
  styleUrls: ["./payment-method.component.scss"],
})
export class PaymentMethodComponent implements OnInit {
  paymentForm: FormGroup;
  upiPaymentForm: FormGroup;
  netBankPaymentForm: FormGroup;
  tansferPaymentForm: FormGroup;
  isTransferProceed: boolean = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private fdApi: FdCalculatorServiceService
  ) {}

  cardType = [
    { bankLogo: "assets/images/image 6.svg", bankName: "Axis Bank" },
    { bankLogo: "assets/images/image 7.svg", bankName: "HDFC Bank" },
    { bankLogo: "assets/images/image 8.svg", bankName: "ICIC Bank" },
  ];
  paymentMethod = new FormControl("Card");
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "80px",
      height: "80px",
    },
  };

  ngOnInit(): void {
    this.buildPayentForm();
  }
  onToggleChange(event) {}
  buildPayentForm() {
    this.paymentForm = this.fb.group({});
    this.upiPaymentForm = this.fb.group({});
    this.netBankPaymentForm = this.fb.group({});
    this.tansferPaymentForm = this.fb.group({});
  }
  processTransferPayment() {
    this.isTransferProceed = true;
  }

  continuePayment() {
    this.dialog.open(SuccessPopupComponent, {
      disableClose: true,
      width: "50%",
    });
  }
}
