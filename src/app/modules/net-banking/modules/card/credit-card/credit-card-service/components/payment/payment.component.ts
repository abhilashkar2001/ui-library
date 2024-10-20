import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { CardService } from "../../../../card.service";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { AccountList } from "app/shared/models/card.model";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
  options: any[] = [
    { label: "Total due", value: "totaldue" },
    { label: "Minimum due", value: "minimumdue" },
    { label: "Other", value: "other" },
  ];
  autoPay: any[] = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  cards: any[] = [];
  selectedAmount: any[] = ["Total due", "Minimum due", "Other"];
  creditPaymentForm: FormGroup;
  customerInfo: any;
  cardList: AccountList[];
  typeofCard: string;
  constructor(
    private fb: FormBuilder,
    private sessionStorage: SessionStorageService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.customerInfo = this.sessionStorage.getCustomerInfo();
    this.cardList = this.sessionStorage.getListOfCards();
    this.buildCreditPaymentForm();
  }

  buildCreditPaymentForm() {
    this.creditPaymentForm = this.fb.group({
      source: ["I"],
      debitAccount: [""],
      debitAmount: [""],
      debitCurrency: [""],
      creditAccount: [this.cardList?.[0]?.cardNumber || ""],
      creditAmount: [""],
      creditCurrency: [""],
      amountPaid: [""],
      cardFundTransfer: this.fb.group({
        totalDue: [""],
        minimumDue: [""],
        other: [""],
        autoPay: [""],
        selectAmount: [""],
        maxAutopayAmount: [""],
        cardDetailsId: [1],
      }),
    });
    this.patchDetails(this.cardList[0]?.cardNumber);
  }

  payFromCurrencyCode(value) {
    this.creditPaymentForm.get("debitCurrency").setValue(value);
  }

  patchDetails(event: any) {
    const account = event;
    const accountDetails = this.cardList?.find(
      (card) => card?.cardNumber == account
    );
    if (accountDetails) {
      this.typeofCard = accountDetails?.typeOfCard;
      this.creditPaymentForm
        .get("cardFundTransfer.totalDue")
        .setValue(accountDetails?.totalDueAmount);
      this.creditPaymentForm
        .get("cardFundTransfer.minimumDue")
        .setValue(accountDetails?.minDueAmount);
    }
  }

  proceed() {
    const selectedCardNumber =
      this.creditPaymentForm?.get("creditAccount")?.value;
    const accountDetails = this.cardList.find(
      (card) => card.cardNumber == selectedCardNumber
    );
    let payload: any = {
      ...this.creditPaymentForm.value,
      customerId: this.customerInfo?.customerId,
    };
    let creditPaymentArr = [
      {
        eventType: "mmidTransfer",
        status: "confirm",
        statusHeader: "Comfirm Details",
        masterId: "benificiaryMasterId",
        statusNews: "Payment sent sucessfully!",
        summary: [
          {
            header: "Card Controls",
            details: [
              {
                "Name on card": this.customerInfo?.customerName,
              },
              {
                "Card Number":
                  this.creditPaymentForm?.get("creditAccount")?.value,
              },
              {
                "Card Name": accountDetails?.cardName,
              },

              {
                "Current Outstanding": accountDetails?.currentOutStaning,
              },
            ],
          },
          {
            header: "Payment Details",
            details: [
              { Name: this.customerInfo?.customerName },
              {
                "Account No": this.creditPaymentForm.get("debitAccount")?.value,
              },
              {
                "Account Type": this.customerInfo?.accounts[0]?.accountType,
              },
              {
                "Payment Amount": this.customerInfo?.accounts[0]?.accountType,
              },
              {
                "Auto type status": this.creditPaymentForm.get(
                  "cardFundTransfer.autoPay"
                )?.value,
              },
              {
                "Selected Amount": this.creditPaymentForm.get(
                  "cardFundTransfer.selectAmount"
                )?.value,
              },
              {
                "Enter Maximum Amount": this.creditPaymentForm.get(
                  "cardFundTransfer.maxAutopayAmount"
                )?.value,
              },
            ],
          },
        ],
      },
    ];
    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      creditPaymentArr,
      (payload) => this.cardService.saveCreditPaymentDetails(payload)
    );
    this.router.navigate(["/send-money/payment-summary"]);
  }
}
