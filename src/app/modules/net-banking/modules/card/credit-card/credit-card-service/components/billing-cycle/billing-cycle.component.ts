import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CreditCardStore } from "../../../credit-card.store";
import { Router } from "@angular/router";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import { CardService } from "../../../../card.service";

@Component({
  selector: "app-billing-cycle",
  templateUrl: "./billing-cycle.component.html",
  styleUrls: ["./billing-cycle.component.scss"],
})
export class BillingCycleComponent implements OnInit {
  billingCycleForm: FormGroup;
  listOfAccounts: any = [];
  profileInfo: any;
  currencyCode: any;
  cardList: any[];
  typeofCard: any;
  listOfCustomers: any[];
  accountDetails: any;
  billingCycleList = CreditCardStore.billCycleList;

  constructor(
    private formBuilder: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private tokenService: TokenStorageService,
    private cardService: CardService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router
  ) {
    this.profileInfo = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.currencyCode = this.profileInfo?.branchCrncyCode;
    this.cardList = this.sessionStorageService.getListOfCards();
    this.listOfAccounts = this.sessionStorageService.getListOfAccounts();
    this.buildFormGroup();
  }

  buildFormGroup() {
    this.billingCycleForm = this.formBuilder.group({
      source: ["I"],
      customerId: [""],
      cardNo: [this.cardList?.[0]?.cardNumber || ""],
      creditAmount: [""],
      creditCurrency: [""],
      requestDate: [""],
      billingCycleDate: [""],
    });
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.cardList?.find(
      (card) => card?.cardNumber == account
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
    }
  }

  proceed() {
    if (!this.billingCycleForm?.valid) return;
    let payload = { ...this.billingCycleForm.value };
    let paymentDetailsArr = [
      {
        eventType: "mmidTransfer",
        operationType: "Billing_Cycle",
        status: "confirm",
        masterId: "retailFundTransferMasterId",
        statusHeader: "Comfirm Payment",
        statusNews: "Billing Cycle Request!",
        summary: [
          {
            header: "Card Control",
            details: [
              { "Name on Card": this.accountDetails?.customerName },
              {
                "Card Number": this.accountDetails?.cardNumber,
              },
              {
                "Card Name": this.accountDetails?.cardName,
              },
              {
                "Credit Limit": this.accountDetails?.totalCreditLimit,
              },
              {
                "Current Billing Cycle": payload?.billingCycleDate,
              },
              {
                "Request Billing Cycle": payload?.requestDate,
              },
            ],
          },
        ],
        qrToggle: false,
      },
    ];
    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      paymentDetailsArr,
      (payload) =>
        this.cardService.saveBillingCycleCreditPaymentDetails(payload)
      // Service call completion callback
    );
    this.router.navigate(["/send-money/payment-summary"]);
  }
}
