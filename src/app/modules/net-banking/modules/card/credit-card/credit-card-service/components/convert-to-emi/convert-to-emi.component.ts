import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { ConvertEmiStore } from './convert-emi.store';
import { CardService } from '../../../../card.service';
import {
  cardTransactionDetails,
  TransactionDetail,
} from 'app/shared/models/emi-converter.model';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { Store } from '@ngrx/store';
import { AppState, selectUser } from '@onerumango/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-convert-to-emi',
  templateUrl: './convert-to-emi.component.html',
  styleUrls: ['./convert-to-emi.component.scss'],
})
export class ConvertToEmiComponent implements OnInit, OnDestroy {
  convertEmiForm!: FormGroup;
  listOfAccounts: string[] = [];
  currencyCode = '';
  notes = ConvertEmiStore.notes;
  viewColumnData = ConvertEmiStore.transactionDetailsHeaders;
  transactionDetails: TransactionDetail[] = [];
  totalTransactionAmount = 0;
  customerId: number | undefined;
  corporateId: number | undefined;
  subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private emiService: CardService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.buildEmiForm();
  }

  loadUserProfile() {
    const userProfileSub = this.store.select(selectUser).subscribe((result) => {
      if (result) {
        this.customerId =
          this.sessionStorageService?.getCustomerInfo()?.customerId;
        this.corporateId = result.corporateCustomerId;
        this.listOfAccounts = this.sessionStorageService?.getListOfCards();
      }
    });
    this.subscriptions.push(userProfileSub);
  }

  // Build the form group for EMI conversion
  private buildEmiForm(): void {
    this.convertEmiForm = this.formBuilder.group({
      cardNumber: [''],
    });
  }

  // Handle transaction details event from a child component
  handleTransactionDetails(cardNumber: string): void {
    if (cardNumber) {
      this.fetchTransactionDetails(cardNumber);
    }
  }

  // Fetch transaction details from the API
  private fetchTransactionDetails(accountNo: string): void {
    this.emiService
      .fetchCardTransactionDetails(accountNo, this.corporateId)
      .subscribe((response: IcHttpResponseModel<cardTransactionDetails>) => {
        if (response && response.statusCode === 200) {
          this.processTransactionData(response.data);
          this.calculateTotalTransactionAmount(this.transactionDetails);
        }
      });
  }

  // Process transaction data
  private processTransactionData(data: any): void {
    this.transactionDetails = data.map((item: any) => ({
      transactionDate: item?.created,
      details: item?.paymentType,
      amount: item?.debitAmount,
      refNo: item?.cbsRefNo,
      convertToEmi: false,
      cardName: item?.cardFundTransfer?.cardDetails?.cardName,
      cardNumber: item?.cardFundTransfer?.cardDetails?.cardNumber,
      cardId: item?.cardFundTransfer?.cardDetails?.id,
      nameOnCard: item?.cardFundTransfer?.cardDetails?.nameOnCard,
      maturityDate: item?.cardFundTransfer?.cardDetails?.dueDate,
    }));
  }

  // Calculate the total amount to be converted
  calculateTotalTransactionAmount(data: TransactionDetail[]): void {
    this.totalTransactionAmount = data
      .filter((item) => item.convertToEmi)
      .reduce((sum, item) => sum + item.amount, 0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
