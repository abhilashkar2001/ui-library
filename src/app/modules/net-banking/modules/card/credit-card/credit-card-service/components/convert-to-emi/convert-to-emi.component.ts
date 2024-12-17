import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { ConvertEmiStore } from './convert-emi.store';
import { CardService } from '../../../../card.service';
import {
  cardTransactionDetails,
  TransactionDetail,
} from 'app/shared/models/emi-converter.model';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import * as moment from 'moment';
import { TokenStorageService } from 'app/shared/token-storage.service';

@Component({
  selector: 'app-convert-to-emi',
  templateUrl: './convert-to-emi.component.html',
  styleUrls: ['./convert-to-emi.component.scss'],
})
export class ConvertToEmiComponent implements OnInit {
  convertEmiForm!: FormGroup;
  listOfAccounts: string[] = [];
  currencyCode = '';
  notes = ConvertEmiStore.notes;
  viewColumnData = ConvertEmiStore.transactionDetailsHeaders;
  transactionDetails: TransactionDetail[] = [];
  totalTransactionAmount = 0;
  customerId: number | any;
  corporateId: string | any;
  constructor(
    private formBuilder: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private emiService: CardService,
    private tokenStorage: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.initializeAccounts();
    this.buildEmiForm();
  }

  // Initialize account list from session storage
  private initializeAccounts(): void {
    this.customerId = this.sessionStorageService?.getCustomerInfo()?.customerId;
    this.corporateId = this.tokenStorage?.getUser()?.corporateCustomerId;
    this.listOfAccounts = this.sessionStorageService?.getListOfCards();
  }

  // Build the form group for EMI conversion
  private buildEmiForm(): void {
    this.convertEmiForm = this.formBuilder.group({
      cardNumber: [''],
    });
  }

  // Handle transaction details event from child component
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

  // Navigate to the EMI calculation route
  proceed(): void {
    const selectedTransactions = this.transactionDetails.filter(
      (item) => item.convertToEmi,
    );
    const noOfElements = selectedTransactions.length;

    if (noOfElements > 0) {
      const maturityDateString = selectedTransactions[0]?.maturityDate;
      const payload = {
        amount: this.totalTransactionAmount,
        noOfElements: noOfElements,
        cardName: selectedTransactions[0]?.cardName,
        cardNumber: selectedTransactions[0]?.cardNumber,
        cardId: selectedTransactions[0]?.cardId,
        nameOnCard: selectedTransactions[0]?.nameOnCard,
        maturityDate: moment(maturityDateString, 'DD-MMM-YYYY').isValid()
          ? moment(maturityDateString, 'DD-MMM-YYYY').format('YYYY-MM-DD')
          : '',
      };
      this.router.navigate(['/card/credit-card/service/calculate-emi'], {
        state: payload,
      });
    }
  }
  // Calculate the total amount to be converted
  calculateTotalTransactionAmount(data: TransactionDetail[]): void {
    this.totalTransactionAmount = data
      .filter((item) => item.convertToEmi)
      .reduce((sum, item) => sum + item.amount, 0);
  }
}
