import { Component, OnInit } from "@angular/core";
import { Cards, HeaderModel } from "app/shared/models/card.model";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { CreditCardStore } from "../credit-card.store";
import { QuickLinkTabModel } from "app/shared/models/tab-model";
import { CardService } from "../../card.service";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-credit-card-dashboard",
  templateUrl: "./credit-card-dashboard.component.html",
  styleUrls: ["./credit-card-dashboard.component.scss"]
})
export class CreditCardDashboardComponent implements OnInit {
  cardList: Cards = [];
  staticCardList: Cards = CreditCardStore.cardList;
  detailsItem: HeaderModel[] = CreditCardStore.detailsItem;
  recentTransTabs = CreditCardStore.recentTransTabs;
  recentTransCols = CreditCardStore.recentTransColumn;
  recentTransData: any;
  quickLinkItems: QuickLinkTabModel[] = CreditCardStore.quickLinks;
  cardSummaryDetails: any;
  corporateId: any;
  profileInfo: any;
  displayCard: any;

  isDrawerOpen = "close";

  constructor(
    private sessionStorageService: SessionStorageService,
    private cardService: CardService,
    private tokenService: TokenStorageService
  ) {
    this.profileInfo = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.cardList = this.sessionStorageService.getListOfCards() || [];
    console.log(this.corporateId);

    this.fetchCardSummaryDetails();
  }

  fetchCardSummaryDetails() {
    if (this.cardList.length > 1) {
      this.sessionStorageService.removeListOfCards();
    }
    this.cardService
      .fetchCardSummary(this.profileInfo?.corporateCustomerId, "Credit Card")
      .subscribe((res) => {
        this.cardSummaryDetails = res?.data;
        this.sessionStorageService.setListOfCards(this.cardSummaryDetails);
        this.fetRecntTransaction();
      });
  }
  getDashboardCardDetails(event: any) {
    this.displayCard = event;
  }

  fetRecntTransaction() {
    console.log("hgfg");

    this.recentTransData = [];
    let cardNumber =
      this.cardSummaryDetails?.[0]?.cardNumber ||
      this.cardList?.[0]?.cardNumber;
    if (cardNumber)
      this.cardService
        .fetchCardRecentTransaction(
          this.profileInfo?.corporateCustomerId,
          cardNumber,
          "Credit Card"
        )
        .subscribe((resp: any) => {
          if (resp?.statusCode == 200) {
            this.recentTransData = resp?.data;
          }
        });
  }

  toggleCheck(value: any) {
    this.isDrawerOpen = value;
    console.log(this.isDrawerOpen);
  }
}
