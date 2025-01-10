import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { cardTransactionDetails } from 'app/shared/models/emi-converter.model';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardService } from '../../../../card.service';
import { CreditCardStore } from '../../../credit-card.store';
import { GETLISTOFACCOUNTS } from 'app/shared/models/session-storage.model';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';

@Component({
  selector: 'app-instant-loan',
  templateUrl: './instant-loan.component.html',
  styleUrls: ['./instant-loan.component.scss'],
})
export class InstantLoanComponent implements OnInit, OnDestroy {
  instantLoanForm!: FormGroup;
  purpose = ['education', 'farming']; // Static purpose options
  loanType = 'FD';
  currencySymbol = '₹';
  amountmax = 1000000;
  amountmin = 10000;
  // thumbLabel: boolean = true;
  maxTenure = 3650;
  minTenure = 7;
  chartData = CreditCardStore.chartData;
  chartSectionDetails = CreditCardStore.instaChart;
  calculatedData: any;
  customerId: any;
  listOfAccounts: any[] = [];
  totalMonths: number | any;
  monthlyEmi: number | any;
  transactionDetails: cardTransactionDetails | any;
  items: string[] | GETLISTOFACCOUNTS[] = [];
  accountDetails: any;
  customerInfo: any;
  profileInfo: any;
  sliderAmount: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private apiService: CardService,
    private serviceCallHandler: ServiceCallHandler,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.initializeAccounts();
    this.buildInstantLoanForm();
    this.sliderAmount = this.instantLoanForm.get('amount')?.value || 0;
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  // Initialize account list from session storage
  private initializeAccounts(): void {
    const customerInfo = this.sessionStorageService.getCustomerInfo();
    this.listOfAccounts = this.sessionStorageService.getListOfCards();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    if (customerInfo) {
      this.customerId = customerInfo.customerId;
      this.items = this.sessionStorageService.getListOfAccounts() || [];
      // this.fetchListOfCards(this.customerId);
    }
  }
  // Build the form for instant loan
  private buildInstantLoanForm(): void {
    this.instantLoanForm = this.fb.group({
      cardNo: [''],
      accountNo: [''],
      amount: [''],
      tenureDays: [''],
      tenureYears: [''],
      tenureMonths: [''],
      creditLoanAmount: [''],
      loanPorpose: [''],
      cardId: [''],
    });
  }

  onDepositAmountChange(value: any): void {
    this.instantLoanForm
      .get('amount')
      ?.setValue(value.srcElement.ariaValueText);
  }

  private parseDurationToDays(duration: string): number {
    const regex = /(\d+)\s*year.*?(\d+)\s*month.*?(\d+)\s*day/;
    const match: any = duration.match(regex);

    if (!match) {
      throw new Error('Invalid duration format');
    }

    const years = parseInt(match[1], 10);
    const months = parseInt(match[2], 10);
    const days = parseInt(match[3], 10);

    return years * 365 + months * 30 + days;
  }

  onSliderChangeForTenure(e: any): void {
    this.totalMonths = 0;
    const duration = e.srcElement.ariaValueText;

    if (duration) {
      // Convert duration to days
      const maxTenure = this.parseDurationToDays(duration);
      const years = Math.floor(maxTenure / 365);
      const remainingDays = maxTenure % 365;
      const months = Math.floor(remainingDays / 30);
      this.totalMonths = this.convertYearsToMonths(years) + months;
      const tomorrow = this.getTomorrowDate();

      this.instantLoanForm.patchValue({
        tenureYears: years,
        tenureMonths: months,
        tenureDays: remainingDays % 30,
      });

      const payload = {
        principleAmount: parseFloat(this.instantLoanForm.value.amount),
        interestRate: 7.28, // Static interest rate
        numberOfMonths: this.totalMonths,
        firstRepaymentDate: tomorrow,
      };

      this.calculateEmi(payload);
    }
  }

  private convertYearsToMonths(years: number): number {
    return years * 12;
  }

  private getTomorrowDate(): string {
    const tomorrow: any = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  // Fetch EMI details
  private calculatorDetails(): void {
    this.apiService
      .fdRdCalculatorDetails(
        this.loanType,
        this.instantLoanForm.value.amount,
        this.instantLoanForm.value.tenureYears,
        this.instantLoanForm.value.tenureMonths,
        this.instantLoanForm.value.tenureDays,
      )
      .subscribe((res: any) => {
        if (res && res.statusCode === 200) {
          this.calculatedData = {
            ...res?.data,
            depositAmount: this.instantLoanForm.value.amount,
            monthlyEmi: this.monthlyEmi,
          };
        }
      });
  }

  // Calculate EMI based on the payload
  private calculateEmi(payload: any): void {
    this.apiService.calculateEmi(payload).subscribe((response) => {
      if (response?.statusCode === 200) {
        this.monthlyEmi = response.data.monthlyPayment;
        this.calculatorDetails();
      }
    });
  }

  // Format slider label for tenure
  formatLabel(value: number | null): string {
    if (!value) return '';

    const years = Math.floor(value / 365);
    const remainingDays = value % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;

    return `${years} year ${months} month ${days} day`;
  }

  // Handle transaction details retrieval
  handleTransactionDetails(cardNumber: string): void {
    if (cardNumber) {
      const account = cardNumber;
      this.accountDetails = this.listOfAccounts?.find(
        (card) => card?.cardNumber == account,
      );
      if (this.accountDetails) {
        this.instantLoanForm
          ?.get('cardId')
          ?.patchValue(this.accountDetails?.id);
      }
      this.fetchTransactionDetails(cardNumber);
    }
  }

  // Fetch transaction details based on account number
  private fetchTransactionDetails(accountNo: string): void {
    this.apiService.fetchCardTransactionDetails(
      accountNo,
      this.profileInfo?.corporateCustomerId,
    );
    this.profileInfo?.corporateCustomerId.subscribe(
      (response: IcHttpResponseModel<cardTransactionDetails>) => {
        if (response?.statusCode === 200) {
          this.transactionDetails = response.data;
        }
      },
    );
  }

  // Proceed with loan application and call service
  proceed(): void {
    const payload = this.constructPayload();
    const instaArray = this.createEmiDetailsArray(payload);

    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      instaArray,
      (convertedPayload) => this.apiService.convertToEmi(convertedPayload),
    );

    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }

  // Construct the payload for the API call
  private constructPayload() {
    return {
      type: 'Insta Loan',
      cardId: this.instantLoanForm?.value?.cardId,
      nameOnCard:
        this.transactionDetails?.cardFundTransfer?.cardDetails?.nameOnCard,
      cardName:
        this.transactionDetails?.cardFundTransfer?.cardDetails?.cardName,
      cardNo:
        this.transactionDetails?.cardFundTransfer?.cardDetails?.cardNumber,
      amount: this.instantLoanForm.value.amount,
      tenure: this.totalMonths,
      interestRate: 7.28,
      maturityDate:
        this.transactionDetails?.cardFundTransfer?.cardDetails?.dueDate,
      monthlyEmi: this.monthlyEmi,
      accountNo: this.instantLoanForm.value.accountNo,
      purposeOfLoan: this.instantLoanForm.value.loanPorpose,
      eligibleAmount: '',
      loanAmount: this.instantLoanForm.value.creditLoanAmount,
      payableAmount: this.calculatedData?.maturityAmount,
      intrestRate: this.calculatedData?.intrestRate,
      intrestAmount: this.calculatedData?.intrestAmount,
      payeeName:
        this.transactionDetails?.cardFundTransfer?.cardDetails?.customerName,
      accountType: 'savings',
    };
  }

  // Create the EMI details array for the service call handler
  private createEmiDetailsArray(payload: any): any[] {
    return [
      {
        eventType: 'instaBank',
        statusHeader: 'Confirm Details',
        statusNews: 'Saved Insta bank successfully!',
        summary: [
          {
            header: 'Card Control',
            details: [
              { 'Name On Card': payload.nameOnCard },
              { 'Card Number': payload.cardNo },
              { 'Card Name': payload.cardName },
              { 'Eligible Amount': payload.eligibleAmount },
            ],
          },
          {
            header: 'Loan Details',
            details: [
              { Amount: payload.loanAmount },
              { 'Interest Rate': payload.interestRate },
              { 'Interest Amount': payload.intrestAmount },
              { Tenure: payload.tenure },
              { 'Maturity Date': payload.maturityDate },
              { 'Monthly Emi': payload.monthlyEmi },
              { 'Card Id': payload.cardId },
            ],
          },
        ],
        qrToggle: false,
      },
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
