import { Component, OnInit } from "@angular/core";
import { Cards, HeaderModel } from "app/shared/models/card.model";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { CreditCardStore } from "../credit-card.store";
import { QuickLinkTabModel } from "app/shared/models/tab-model";
import { CardService } from "../../card.service";

@Component({
  selector: "app-credit-card-dashboard",
  templateUrl: "./credit-card-dashboard.component.html",
  styleUrls: ["./credit-card-dashboard.component.scss"],
})
export class CreditCardDashboardComponent implements OnInit {
  cardList: Cards = [];
  staticCardList: Cards = CreditCardStore.cardList;
  detailsItem: HeaderModel[] = CreditCardStore.detailsItem;
  recentTransTabs = CreditCardStore.recentTransTabs;
  recentTransCols = CreditCardStore.recentTransColumn;
  recentTransData = CreditCardStore.recentTransData;
  quickLinkItems: QuickLinkTabModel[] = CreditCardStore.quickLinks;
  customerInfo: any;

  constructor(
    private sessionStorageService: SessionStorageService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.cardList = this.sessionStorageService.getListOfCards() || [];
    this.fetchCardSummaryDetails();
  }

  fetchCardSummaryDetails() {
    this.cardService
      .fetchCardSummary(this.customerInfo?.customerId, "Credit Card")
      .subscribe((res) => {
        console.log(res);
      });
  }
}
