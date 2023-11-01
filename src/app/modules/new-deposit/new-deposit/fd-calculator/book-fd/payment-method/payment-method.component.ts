import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FdCalculatorServiceService } from "../../fd-calculator-service.service";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";

@Component({
  selector: "app-payment-method",
  templateUrl: "./payment-method.component.html",
  styleUrls: ["./payment-method.component.scss"],
})
export class PaymentMethodComponent implements OnInit {
  @Input() depositType: any;
  paymentForm: FormGroup;
  upiPaymentForm: FormGroup;
  netBankPaymentForm: FormGroup;
  tansferPaymentForm: FormGroup;
  isTransferProceed: boolean = false;
  originId: string;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private fdApi: FdCalculatorServiceService
  ) {}

  cardType = [
    { bankLogo: "assets/images/axis_Bank_Logo.svg", bankName: "Axis Bank" },
    { bankLogo: "assets/images/hdfc_Bank_Logo.svg", bankName: "HDFC Bank" },
    { bankLogo: "assets/images/icici_Bank_Logo.svg", bankName: "ICICI Bank" },
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
    if (sessionStorage.getItem("depositOriginationId"))
      this.originId = sessionStorage.getItem("depositOriginationId");
    this.dialog.open(SuccessPopupComponent, {
      data: {
        originationId: this.originId,
        type: this.depositType,
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
  }
}
