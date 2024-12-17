import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardService } from '../../../../card.service';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { AccountList } from 'app/shared/models/card.model';
import { TokenStorageService } from 'app/shared/token-storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  options: any[] = [
    { label: 'Total due', value: 'totaldue' },
    { label: 'Minimum due', value: 'minimumdue' },
    { label: 'Other', value: 'other' },
  ];
  autoPay: any[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  cards: any[] = [];
  selectedAmount: any[] = ['Total due', 'Minimum due', 'Other'];
  creditPaymentForm!: FormGroup;
  customerInfo: any;
  cardList: AccountList[] | any;
  typeofCard: string | any;
  profileInfo: any;
  constructor(
    private fb: FormBuilder,
    private sessionStorage: SessionStorageService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
    private cardService: CardService,
    private tokenService: TokenStorageService,
  ) {
    this.profileInfo = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.customerInfo = this.sessionStorage.getCustomerInfo();
    this.cardList = this.sessionStorage.getListOfCards();
    this.buildCreditPaymentForm();
  }

  buildCreditPaymentForm() {
    this.creditPaymentForm = this.fb.group({
      source: ['C'],
      corpFundDetails: this.fb.array([]),
    });
    this.getFundDetails();
  }

  getFundDetails() {
    this.paymentControl.push(
      this.fb.group({
        debitAccount: [''],
        debitAmount: [''],
        debitCurrency: [''],
        creditAccount: [''],
        creditAmount: [''],
        creditCurrency: [''],
        amountPaid: [''],
        cardFundTransfer: this.fb.group({
          totalDue: [''],
          minimumDue: [''],
          other: [''],
          autoPay: [''],
          selectAmount: [''],
          maxAutopayAmount: [''],
          cardDetailsId: [''],
        }),
      }),
    );
  }

  get paymentControl(): FormArray {
    return this.creditPaymentForm.get('corpFundDetails') as FormArray;
  }

  payFromCurrencyCode(value: any) {
    this.paymentControl.get('debitCurrency')?.setValue(value);
  }

  patchDetails(event: any) {
    const account = event;
    const accountDetails = this.cardList?.find(
      (card: any) => card?.cardNumber == account,
    );

    if (accountDetails) {
      this.typeofCard = accountDetails?.typeOfCard;
      const currentIndex = 0;
      const currentDetailGroup = this.paymentControl.at(currentIndex);
      currentDetailGroup
        .get('cardFundTransfer.totalDue')
        ?.setValue(accountDetails?.totalDueAmount);
      currentDetailGroup
        .get('cardFundTransfer.minimumDue')
        ?.setValue(accountDetails?.minDueAmount);
      currentDetailGroup
        .get('creditAccount')
        ?.patchValue(accountDetails?.cardNumber);
      currentDetailGroup
        .get('creditCurrency')
        ?.patchValue(accountDetails?.currencyCode);
      currentDetailGroup
        .get('cardFundTransfer.cardDetailsId')
        ?.patchValue(accountDetails?.id);
    }
  }

  proceed() {
    const selectedCardNumber =
      this.creditPaymentForm.get('creditAccount')?.value;
    const accountDetails = this.cardList.find(
      (card: any) => card.cardNumber === selectedCardNumber,
    );
    if (!accountDetails) {
      console.error('Account details not found for the selected card number.');
      return;
    }
    const payload: any = {
      ...this.creditPaymentForm.value,
      corporateId: this.profileInfo?.corporateCustomerId,
    };
    const fundDetails = this.paymentControl.at(0);

    const creditPaymentArr = [
      {
        eventType: 'mmidTransfer',
        status: 'confirm',
        statusHeader: 'Confirm Details',
        masterId: 'benificiaryMasterId',
        statusNews: 'Payment sent successfully!',
        summary: [
          {
            header: 'Card Controls',
            details: [
              { 'Name on card': this.customerInfo?.customerName },
              { 'Card Number': fundDetails.get('creditAccount')?.value },
              { 'Card Name': accountDetails.cardName },
              { 'Current Outstanding': accountDetails.currentOutStaning },
            ],
          },
          {
            header: 'Payment Details',
            details: [
              { Name: this.customerInfo?.customerName },
              {
                'Account No': this.creditPaymentForm.get('debitAccount')?.value,
              },
              { 'Account Type': this.customerInfo?.accounts[0]?.accountType },
              { 'Payment Amount': fundDetails.get('debitAmount')?.value },
              {
                'Auto type status': fundDetails.get('cardFundTransfer.autoPay')
                  ?.value,
              },
              {
                'Selected Amount': fundDetails.get(
                  'cardFundTransfer.selectAmount',
                )?.value,
              },
              {
                'Enter Maximum Amount': fundDetails.get(
                  'cardFundTransfer.maxAutopayAmount',
                )?.value,
              },
            ],
          },
        ],
      },
    ];

    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      creditPaymentArr,
      (response) => this.cardService.saveCreditPaymentDetails(response),
    );

    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }
}
