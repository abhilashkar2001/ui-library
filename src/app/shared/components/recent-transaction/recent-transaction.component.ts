import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CreatedDurationModelComponent } from '../created-duration-model/created-duration-model.component';
import { CardService } from 'app/modules/net-banking/modules/card/card.service';
import { CardModel } from 'app/shared/models/card.model';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-recent-transaction',
  templateUrl: './recent-transaction.component.html',
  styleUrls: ['./recent-transaction.component.scss'],
})
export class RecentTransactionComponent implements OnInit {
  @Output() tabChanged = new EventEmitter<any>();
  @Input() customerInfo: any;
  @Input() selectedAcc: any;

  @Input() showMoneyStatusIcon: any;
  @Input()
  recentTransTabs: any;
  @Input() recentTransCols: any;
  @Input() recentTransData: any;
  @Input() event: any;
  @Input() cardInfo: any;
  selectedRecentTab: any;
  searchValue: FormControl = new FormControl('');
  selectedDate: FormControl = new FormControl('');

  actionDateOptions = [
    { value: 'ONEDAY', label: 'Today' },
    { value: 'ONEWEEK', label: 'Last 7 days' },
    { value: 'CURRENTMONTH', label: 'Current Month' },
    { value: 'LASTTHREEMONTH', label: 'Last 3 Month' },
    { value: 'DATERANGE', label: 'Select Date Range' },
  ];

  fromDate: string | any;
  toDate: string | any;
  createdDate: string | any;
  cardList: CardModel[] | any;
  profileInfo: any;
  page: any;
  recentTransMetaData: any;
  pageSize: any;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private sessionStorageService: SessionStorageService,
    private cardService: CardService,
    private dialog: MatDialog,
    private router: Router,
    private tokenService: TokenStorageService,
  ) {
    this.profileInfo = this.tokenService.getUser();
    this.matIconRegistry.addSvgIcon(
      'search-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/search-icon.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'filter-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/filter-icon.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'extend-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/extend-arrow.svg',
      ),
    );
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.recentTransData) {
      if (changes.recentTransData.currentValue) {
        this.recentTransData = changes.recentTransData.currentValue;
      }
    }
    if (changes.customerInfo) {
      if (changes.customerInfo.currentValue) {
        this.customerInfo = changes.customerInfo.currentValue;
      }
    }
    if (changes.selectedAcc) {
      if (changes.selectedAcc.currentValue) {
        this.selectedAcc = changes.selectedAcc.currentValue;
      }
    }
    if (this.event == 'Credit Card') {
      this.fetchRecentTransactionCreditCards();
    } else if (this.event == 'Debit Card') {
      this.fetchRecentTransactionDebitCards();
    } else {
      this.fetRecntTransaction();
    }
  }

  ngOnInit(): void {
    this.cardList = this.sessionStorageService.getListOfCards();
    if (this.recentTransTabs?.length > 0)
      this.selectedRecentTab = this.recentTransTabs[0];
  }

  changeRecentTransTabs(i: any) {
    this.selectedRecentTab = this.recentTransTabs[i];
    this.tabChanged.emit(this.selectedRecentTab);
    this.recentTransTabChange(this.selectedRecentTab);
  }
  filterSearchValue() {
    this.recentTransTabChange(this.selectedRecentTab);
  }
  recentTransTabChange(event: any) {
    //For now only "Account" tab is working.Once Other tabs functionality will come then for rest tab will call api
    if (event == 'Account') {
      this.fetRecntTransaction('Account');
    } else if (event == 'MMID') {
      this.fetRecntTransactionScreenWise('MMID');
    } else if (event == 'Abroad') {
      this.fetRecntTransactionScreenWise('Send Money Abroad');
    } else if (event === 'Credit Card') {
      this.fetchRecentTransactionCreditCards();
    } else if (event === 'Debit Card') {
      this.fetchRecentTransactionDebitCards();
    } else this.recentTransData = [];
  }

  createpayload() {
    let payload: any;
    if (this.selectedDate.value == 'DATERANGE') {
      payload = {
        searchValue: this.searchValue.value,
        fromDate: this.fromDate,
        toDate: this.toDate,
      };
    } else {
      payload = {
        searchValue: this.searchValue.value,
        createdDate: this.selectedDate.value,
      };
    }
    return payload;
  }
  fetRecntTransaction(event?: any) {
    const customer = this.sessionStorageService.getCustomerInfo();
    this.recentTransData = [];

    this.page = event?.value?.page;
    this.pageSize = event?.value?.pageSize;

    this.cardService
      .fetchAllRecentTransaction(customer.customerId, this.createpayload())
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.recentTransData = resp?.data;
          this.recentTransData.forEach((element: any) => {
            element.action = 'Repay';
            const date = new Date(element.created);
            const formattedDate = date.toISOString().split('T')[0];
            element.created = formattedDate;
          });

          this.recentTransMetaData = resp?.meta || {
            page: this.page,
            size: this.pageSize,
            totalElements: resp?.data?.length,
          };
        }
      });
  }

  fetchRecentTransactionCreditCards() {
    const customerInfo = this.sessionStorageService.getCustomerInfo();
    this.recentTransData = [];
    this.cardService
      .fetchCreditCardRecentTransaction(
        customerInfo?.customerId,
        this.cardInfo?.cardNumber,
        'Credit Card',
      )
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.recentTransData = resp?.data;
        }
      });
  }

  fetchRecentTransactionDebitCards() {
    this.recentTransData = [];
    this.cardService
      .fetchDebitCardRecentTransaction(this.cardInfo?.cardNumber, 'Debit Card')
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.recentTransData = resp?.data;
        }
      });
  }

  fetRecntTransactionScreenWise(screen: any) {
    const customer = this.sessionStorageService.getCustomerInfo();
    this.recentTransData = [];
    console.log(this.createpayload());

    this.cardService
      .fetchScreenWiseRecentTrans(
        screen,
        customer.customerId,
        this.createpayload(),
      )
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.recentTransData = resp?.data;
          this.recentTransData.forEach((element: any) => {
            // if (element.creditAmount != null) {
            //   if (selectedAcc == element?.debitAccount)

            //     element.creditAmount = -element?.creditAmount;
            //   else element.creditAmount = +element?.creditAmount;
            // }
            element.action = 'Repay';
            const date = new Date(element.created);
            const formattedDate = date.toISOString().split('T')[0];
            element.created = formattedDate;
          });
        }
      });
  }

  checkValue(event: any) {
    if (event === 'DATERANGE') this.openDuration();
    this.recentTransTabChange(this.selectedRecentTab);
  }

  openDuration() {
    const dialogRef = this.dialog.open(CreatedDurationModelComponent, {
      width: '40%',
      maxWidth: 'max-content',
      disableClose: true,
      panelClass: 'popup-class-approve',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fromDate = result[0];
        this.toDate = result[1];
        this.recentTransTabChange(this.selectedRecentTab);
      }
    });
  }

  gotoBillTransaction() {
    this.router.navigate([
      '/user/card/credit-card/service/unbilled-transaction',
    ]);
  }
}
