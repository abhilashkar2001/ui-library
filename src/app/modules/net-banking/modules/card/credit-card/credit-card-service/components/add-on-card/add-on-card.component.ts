import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
// import { CreditCardService } from "../../../credit-card.service";
import { Router } from "@angular/router";
import { CreditCardStore } from "../../../credit-card.store";
import { CardService } from "../../../../card.service";
import { AccountList } from "app/shared/models/card.model";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-add-on-card",
  templateUrl: "./add-on-card.component.html",
  styleUrls: ["./add-on-card.component.scss"],
})
export class AddOnCardComponent implements OnInit {
  addonCardForm: FormGroup;
  cardList: AccountList[];
  typeofCard: string;
  currencyCode: string;
  accountDetails: AccountList;
  profileInfo: any;
  items = CreditCardStore.relationShipDetail;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private sessionStorageService: SessionStorageService,
    private tokenService: TokenStorageService,
    private cardService: CardService
  ) {
    this.profileInfo = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.currencyCode = this.profileInfo?.branchCrncyCode;
    this.cardList = this.sessionStorageService.getListOfCards();
    this.buildAddonCardForm();
  }
  buildAddonCardForm() {
    this.addonCardForm = this.fb.group({
      cardNumber: [""],
      accountNo: [""],
      nameRequired: [""],
      relationShip: [""],
      dateOfBirth: [""],
    });
  }
  payFromCurrencyCode(value) {
    this.addonCardForm?.get("debitCurrency").setValue(value);
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.cardList?.find(
      (card) => card?.cardNumber == account
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
      this.addonCardForm
        ?.get("cardNumber")
        ?.patchValue(this.accountDetails?.cardNumber);
    }
  }

  proceed() {
    if (!this.addonCardForm?.valid) return;
    let payload = { ...this.addonCardForm.value };
    let paymentDetailsArr = [
      {
        eventType: "mmidTransfer",
        operationType: "Autopay",
        status: "confirm",
        masterId: "retailFundTransferMasterId",
        statusHeader: "Comfirm Payment",
        statusNews: "Add-on Card Request!",
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
            ],
          },
          {
            header: "Card Control",
            details: [
              { "Name Required": payload?.nameRequired },
              {
                "Date Of Birth": payload?.dateOfBirth,
              },
              {
                Relationship: payload?.relationShip,
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
      (payload) => this.cardService.saveAddOnCreditPaymentDetails(payload)
      // Service call completion callback
    );
    this.router.navigate(["/user/card/credit-card/service/payment-summary"]);
  }
}
