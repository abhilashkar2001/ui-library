import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { AccountList } from "app/shared/models/card.model";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import { CardService } from "../../../card.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-block-card",
  templateUrl: "./block-card.component.html",
  styleUrls: ["./block-card.component.scss"]
})
export class BlockCardComponent implements OnInit {
  blockCardForm!: FormGroup;
  reasons: any[] = [
    { label: "Lost/Stolen", value: "Lost/Stolen" },
    { label: "Damaged", value: "Damaged" }
  ];
  selectedCurrency: any;
  reIssueToggle: boolean | any;
  cardList: AccountList[] | any;
  typeofCard: string | any;
  currencyCode: string | any;
  profileInfo: any;
  communicationAddress: any;
  permanentAddress: string | any;
  accountDetails: AccountList | any;
  title: string | any;

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private tokenService: TokenStorageService,
    private creditCardService: CardService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router
  ) {
    this.profileInfo = this.tokenService.getUser();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd) // Regular filter
      )
      .subscribe((event) => {
        const navEndEvent = event as NavigationEnd; // Type assertion
        this.updateItemsBasedOnUrl(navEndEvent.url);
      });
  }

  ngOnInit(): void {
    this.currencyCode = this.profileInfo?.branchCrncyCode;
    this.cardList = this.sessionStorageService.getListOfCards();
    this.buildBlockCard();
  }
  buildBlockCard() {
    this.blockCardForm = this.fb.group({
      source: ["I"],
      creditAccount: [""],
      creditAmount: [""],
      creditCurrency: [""],
      reason: [""],
      address: [""],
      reIssueToggle: [""]
    });
  }

  /**
   * update Items Based on url
   * @param url -url of the activated route
   */
  private updateItemsBasedOnUrl(url: string) {
    if (url.includes("/credit-card")) {
      this.title = "Credit Card";
    } else if (url.includes("/debit-card")) {
      this.title = "Debit Card";
    } else if (url.includes("/prepaid-card")) {
      this.title = "Prepaid Card";
    }
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.cardList?.find(
      (card: any) => card?.cardNumber == account
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
    }
  }
  payAccount(event: any) {
    console.log(event);
    let listOfAccounts = this.sessionStorageService.getListOfAccounts();
    this.selectedCurrency = listOfAccounts.find(
      (res) => res?.accountNo == event
    )?.accountCurrency;
  }
  onReIssuePreferanceChange(e: any) {
    this.reIssueToggle = e?.checked;
    this.blockCardForm?.get("reIssueToggle")?.patchValue(this.reIssueToggle);
    if (this.reIssueToggle === true) {
      this.fetchAddressDetails();
    }
  }

  fetchAddressDetails() {
    this.creditCardService
      .fetchbycustomerId(this.profileInfo?.corporateCustomerId)
      .subscribe((res) => {
        if (res?.data?.[0]?.contact?.address?.length === 1) {
          this.communicationAddress = this.communicationAddress =
            res?.data?.[0]?.contact?.address?.[0]?.address1 +
            " ," +
            res?.data?.[0]?.contact?.address?.[0]?.address2 +
            " ," +
            res?.data?.[0]?.contact?.address?.[0]?.cityName +
            " ," +
            res?.data?.[0]?.contact?.address?.[0]?.countryName +
            " ," +
            res?.data?.[0]?.contact?.address?.[0]?.stateName +
            "-" +
            res?.data?.[0]?.contact?.address?.[0]?.pincode;
        } else {
          res?.data?.forEach((element: any) => {
            if (element?.addressType === "Communication") {
              this.communicationAddress =
                element?.address1 +
                " ," +
                element?.address2 +
                " ," +
                element?.cityName +
                " ," +
                element?.countryName +
                " ," +
                element?.stateName +
                "-" +
                element?.pincode;
            } else if (element?.addressType === "Permanent") {
              this.permanentAddress =
                element?.address1 +
                " ," +
                element?.address2 +
                " ," +
                element?.cityName +
                " ," +
                element?.countryName +
                " ," +
                element?.stateName +
                "-" +
                element?.pincode;
            }
          });
        }
      });
  }

  proceed() {
    if (!this.blockCardForm?.valid) return;
    let payload = { ...this.blockCardForm.value };
    let paymentDetailsArr = [
      {
        eventType: "mmidTransfer",
        operationType: "Block_Card",
        status: "confirm",
        masterId: "retailFundTransferMasterId",
        statusHeader: "Comfirm Payment",
        statusNews: "Block Card Successfully!",
        summary: [
          {
            header: "Card Control",
            details: [
              { "Card Holder": this.accountDetails?.customerName },
              {
                "Card Number": this.accountDetails?.cardNumber
              },
              {
                "Card Name": this.accountDetails?.cardName
              },
              {
                "Credit Limit": this.accountDetails?.totalCreditLimit
              }
            ]
          },
          {
            header: "Block Details",
            details: [
              { Reason: payload?.reason },
              {
                "Re-Issue Card": payload?.reIssueToggle
              }
            ]
          }
        ],
        qrToggle: false
      }
    ];
    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      paymentDetailsArr,
      (payload) =>
        this.creditCardService.saveBlockPayCreditPaymentDetails(payload)
      // Service call completion callback
    );
    this.router.navigate(["/user/card/credit-card/service/payment-summary"]);
  }
}
