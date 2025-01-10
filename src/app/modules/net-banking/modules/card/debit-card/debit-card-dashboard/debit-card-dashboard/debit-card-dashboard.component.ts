import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cards, HeaderModel } from 'app/shared/models/card.model';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { QuickLinkTabModel } from 'app/shared/models/tab-model';
import { CardService } from '../../../card.service';
import { DebitCardStore } from '../../debit-card.store';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';

@Component({
  selector: 'app-debit-card-dashboard',
  templateUrl: './debit-card-dashboard.component.html',
  styleUrls: ['./debit-card-dashboard.component.scss'],
})
export class DebitCardDashboardComponent implements OnInit, OnDestroy {
  cardList: Cards = [];
  detailsItem: HeaderModel[] = DebitCardStore.detailsItem;
  recentTransTabs = DebitCardStore.recentTransTabs;
  recentTransCols = DebitCardStore.recentTransColumn;
  recentTransData: any;
  quickLinkItems: QuickLinkTabModel[] = DebitCardStore.quickLinks;
  cardSummaryDetails: any;
  profileInfo: any;
  displayCard: any;
  isDrawerOpen = 'close';
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private sessionStorageService: SessionStorageService,
    private cardService: CardService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
  }

  ngOnInit(): void {
    this.cardList = this.sessionStorageService.getListOfCards() || [];
    this.fetchCardSummaryDetails();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  fetchCardSummaryDetails() {
    if (this.cardList.length > 1) {
      this.sessionStorageService.removeListOfCards();
    }
    this.cardService
      .fetchCardSummary(this.profileInfo?.corporateCustomerId, 'Debit Card')
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
    this.recentTransData = [];
    const cardNumber =
      this.cardSummaryDetails?.[0]?.cardNumber ||
      this.cardList?.[0]?.cardNumber;
    if (cardNumber)
      this.cardService
        .fetchCardRecentTransaction(
          this.profileInfo?.corporateCustomerId,
          cardNumber,
          'Debit Card',
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

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
