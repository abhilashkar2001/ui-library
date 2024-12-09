import { Component, OnInit } from "@angular/core";
import { Cards, HeaderModel } from "app/shared/models/card.model";
import { QuickLinkTabModel } from "app/shared/models/tab-model";
import { CreditCardStore } from "../../../credit-card/credit-card.store";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { CardService } from "../../../card.service";
import { PrepaidCardStore } from "../../prepaid-card.store";
@Component({
  selector: "app-prepaid-dashboard",
  templateUrl: "./prepaid-dashboard.component.html",
  styleUrls: ["./prepaid-dashboard.component.scss"]
})
export class PrepaidDashboardComponent implements OnInit {
  quickLinkItems: QuickLinkTabModel[] = PrepaidCardStore.prepaidQuickLinks;
  cardList: Cards = [];
  staticCardList: Cards = CreditCardStore.cardList;
  detailsItem: HeaderModel[] = PrepaidCardStore.prepaidDetailsItem;
  recentTransTabs = PrepaidCardStore.recentTransTabs;
  recentTransCols = CreditCardStore.recentTransColumn;
  recentTransData = CreditCardStore.recentTransData;
  customerInfo: any;
  cardSummaryDetails: any;
  displayCard: any;

  constructor(
    private sessionStorageService: SessionStorageService,
    private prepaidCardService: CardService
  ) {}

  ngOnInit(): void {
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.fetchCardSummaryDetails();
  }
  fetchCardSummaryDetails() {
    this.prepaidCardService
      .fetchCardSummary(this.customerInfo?.customerId, "Prepaid Card")
      .subscribe((res) => {
        this.cardSummaryDetails = res?.data;
        this.sessionStorageService.setListOfCards(this.cardSummaryDetails);
        this.fetchRecentTransaction();
      });
  }

  fetchRecentTransaction() {
    this.prepaidCardService
      .fetchRecentTransaction(
        this.displayCard?.cardNumber ?? this.cardSummaryDetails?.[0]?.cardNumber
      )
      .subscribe((res) => {
        if (res?.statusCode == 200 && res?.data)
          this.recentTransData = res?.data;
      });
  }

  getDashboardCardDetails(event: any) {
    this.displayCard = event;
  }
}
