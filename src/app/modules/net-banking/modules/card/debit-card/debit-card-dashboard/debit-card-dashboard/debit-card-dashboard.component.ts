import { Component, OnInit } from "@angular/core";
import { Cards, HeaderModel } from "app/shared/models/card.model";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { QuickLinkTabModel } from "app/shared/models/tab-model";
import { TokenStorageService } from "app/shared/token-storage.service";
import { CardService } from "../../../card.service";
import { DebitCardStore } from "../../debit-card.store";

@Component({
  selector: "app-debit-card-dashboard",
  templateUrl: "./debit-card-dashboard.component.html",
  styleUrls: ["./debit-card-dashboard.component.scss"]
})
export class DebitCardDashboardComponent implements OnInit {
  cardList: Cards = [];
  detailsItem: HeaderModel[] = DebitCardStore.detailsItem;
  recentTransTabs = DebitCardStore.recentTransTabs;
  recentTransCols = DebitCardStore.recentTransColumn;
  recentTransData: any;
  quickLinkItems: QuickLinkTabModel[] = DebitCardStore.quickLinks;
  cardSummaryDetails: any;
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
    this.fetchCardSummaryDetails();
  }

  fetchCardSummaryDetails() {
    if (this.cardList.length > 1) {
      this.sessionStorageService.removeListOfCards();
    }
    this.cardService
      .fetchCardSummary(this.profileInfo?.corporateCustomerId, "Debit Card")
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
          "Debit Card"
        )
        .subscribe((resp: any) => {
          if (resp?.statusCode == 200) {
            this.recentTransData = resp?.data;
          }
        });
  }

  toggleCheck(value: any) {
    this.isDrawerOpen = value;
  }
}
