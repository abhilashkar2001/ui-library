import { Component, OnInit } from "@angular/core";
import { Cards, HeaderModel } from "app/shared/models/card.model";
import { QuickLinkTabModel } from "app/shared/models/tab-model";
import { CreditCardStore } from "../../../credit-card/credit-card.store";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { CardService } from "../../../card.service";
@Component({
  selector: "app-prepaid-dashboard",
  templateUrl: "./prepaid-dashboard.component.html",
  styleUrls: ["./prepaid-dashboard.component.scss"],
})
export class PrepaidDashboardComponent implements OnInit {
  quickLinkItems: QuickLinkTabModel[]
  cardList: Cards = [];
  staticCardList: Cards = CreditCardStore.cardList;
  detailsItem: HeaderModel[] = CreditCardStore.detailsItem;
  recentTransTabs = CreditCardStore.recentTransTabs;
  recentTransCols = CreditCardStore.recentTransColumn;
  recentTransData = CreditCardStore.recentTransData;
  customerInfo: any;
  cardSummaryDetails: any;
  displayCard: any;

  constructor(private sessionStorageService: SessionStorageService,
    private prepaidCardService:CardService
  ) {}

  ngOnInit(): void {
    this.cardList = this.sessionStorageService.getListOfCards() || [];
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.fetchCardSummaryDetails();
    this.fetchRecentTransaction();
  }
  fetchCardSummaryDetails() {
    this.prepaidCardService
      .fetchCardSummary(this.customerInfo?.customerId, "Credit Card")
      .subscribe((res) => {
        this.cardSummaryDetails = res?.data;
        this.sessionStorageService.setListOfCards(this.cardSummaryDetails);
      });
  }

  fetchRecentTransaction() {
    this.prepaidCardService
      .fetchRecentTransaction(this.cardList[0]?.cardNumber)
      .subscribe((res) => {
        if (res?.statusCode == 200 && res?.data)
          this.recentTransData = res?.data;
      });
  }
  
  getDashboardCardDetails(event) {
    this.displayCard = event;
  }
}
