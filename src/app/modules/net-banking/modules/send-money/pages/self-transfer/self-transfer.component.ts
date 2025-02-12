import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getCurrencySymbol } from '@angular/common';
import { ServiceCallHandler } from 'app/shared/services/service-call.handler';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { SelfTransferService } from 'app/shared/services/fund-transfer/self-transfer.service';
import { ChequeService } from 'app/modules/net-banking/modules/dashboard/modules/cheque-book/cheque-service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectUser } from '@onerumango/utils';
import { User } from '@onerumango/utils';

@Component({
  selector: 'app-self-transfer',
  templateUrl: './self-transfer.component.html',
  styleUrls: ['./self-transfer.component.scss'],
})
export class SelfTransferComponent implements OnInit, AfterViewInit, OnDestroy {
  selfTransferForm: FormGroup | any;
  purposeItems = [
    { label: 'Deposit', value: 'Deposit' },
    { label: 'Loan', value: 'Loan' },
    { label: 'Credit Card', value: 'Credit Card' },
  ];
  currenctUser: any;
  roughNo: any;
  accountDetails: any;
  accountNumberData: any;
  customerInfo: any;
  payFrom: any = [];
  listAccounts: any;
  listOfAccounts: any;
  genericValue: any = { TYPE: [] };
  filteredAccountList: any[] = [];
  toAccountBalance: number | any;
  toAccount: any;
  creditAccountDetails: any;
  selectedCurrency: any;
  fetchedDetails: any;
  categoryTypes: any[] = [];
  accountType: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private selfService: SelfTransferService,
    private genericValueService: GenericValueService,
    private dashboardService: ChequeService,
    private sessionStorageService: SessionStorageService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  async ngOnInit() {
    this.loadUserProfile();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.fetchGenericValues();
    this.fetchAccounts();
    this.buildFormGroup();

    this.fetchedDetails = await this.serviceCallHandler.get(
      'serviceHandler',
      true,
    );
    if (this.fetchedDetails) {
      if (this.fetchedDetails?.paymentType)
        this.selfTransferForm
          .get('type')
          ?.setValue(this.fetchedDetails?.paymentType);

      if (this.fetchedDetails?.creditAccount)
        this.selfTransferForm
          .get('payTo')
          ?.setValue(this.fetchedDetails?.creditAccount);

      if (this.fetchedDetails?.creditAmount)
        this.selfTransferForm
          .get('amount')
          ?.setValue(this.fetchedDetails?.creditAmount);

      if (this.fetchedDetails?.remarks)
        this.selfTransferForm
          .get('remark')
          ?.setValue(this.fetchedDetails?.remarks);
    }
    if (this.customerInfo?.accounts) {
      this.categoryTypes = [];
      this.customerInfo?.accounts.filter((element: any) => {
        if (element?.type === 'Accounts') {
          this.categoryTypes.push({ value: element.accountType });
        }
      });
    }
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currenctUser = result;
        console.log(this.currenctUser, 'currentuser');
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  ngAfterViewInit(): void {
    this.checkDebitDetails(this.selfTransferForm.get('payFrom')?.value);
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k]),
          );
        }
      });
  }

  buildFormGroup() {
    this.selfTransferForm = this.fb.group({
      payFrom: [''],
      type: [''],
      payTo: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      remark: [''],
      source: ['I'],
      transferType: 'Self Transfer',
      creditAccount: [''],
      creditCurrency: [''],
      creditBranch: [''],
      debitAccount: [''],
      debitCurrency: [''],
      debitBranch: [''],
      corpCustomerId: [this.customerInfo?.customerId],
    });
  }

  fetchAccounts() {
    const listOfAccounts = this.sessionStorageService.getListOfAccounts();
    if (listOfAccounts) {
      this.listAccounts = listOfAccounts;
    }
  }

  checkCreditDetails(value: any) {
    const val = this.listAccounts.find((item: any) => item.accountNo === value);
    this.toAccount = val;
    this.selfTransferForm.get('creditAccount')?.patchValue(val?.accountNo);
    this.selfTransferForm
      .get('creditCurrency')
      ?.patchValue(val?.accountCurrency);
    this.selfTransferForm.get('creditBranch')?.patchValue(val?.accountBranch);
    this.getCreditAccountDetails(value);
    this.dashboardService.fetchBalance(value).subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.toAccountBalance = res?.data?.currbal;
      } else {
        this.toAccountBalance = 0;
      }
    });
  }

  updateFilteredPayToList(value: any) {
    const filteredAccount: any = [];
    this.toAccountBalance = 0;
    this.customerInfo.accounts
      ?.filter((account: any) => account.accountType == value)
      .forEach((account: any) =>
        account?.accountList?.forEach((item: any) => {
          filteredAccount.push(item);
        }),
      );
    this.filteredAccountList = filteredAccount.filter(
      (item: any) => item?.accountNo != this.selfTransferForm.value.payFrom,
    );
  }

  checkDebitDetails(value: any) {
    const val = this.listAccounts.find((item: any) => item.accountNo === value);
    this.selfTransferForm.get('debitAccount')?.patchValue(val?.accountNo);
    this.selfTransferForm
      .get('debitCurrency')
      ?.patchValue(val?.accountCurrency);
    this.selfTransferForm.get('debitBranch')?.patchValue(val?.accountBranch);
    this.getAccountDetails(val?.accountNo);
  }

  getAccountDetails(accountNumber: any) {
    if (accountNumber)
      this.selfService.getAccountDetails(accountNumber).subscribe((res) => {
        this.accountDetails = res?.data;
      });
  }
  getCreditAccountDetails(accountNumber: any) {
    this.selfService.getAccountDetails(accountNumber).subscribe((res) => {
      this.creditAccountDetails = res?.data;
    });
  }
  onSubmit() {
    if (this.selfTransferForm?.invalid) {
      this.selfTransferForm.markAllAsTouched();
      return;
    }

    const payload: any = {
      ...this.selfTransferForm.value,
      debitAmount: this.selfTransferForm.value.amount,
      creditAmount: this.selfTransferForm.value.amount,
    };

    const paymentDetailsArr = [
      {
        transferHeader: 'Send Money',
        transferType: 'Self Transfer',
        eventType: 'mmidTransfer',
        operationType: 'Self_Transfer',
        status: 'confirm',
        masterId: 'retailFundTransferMasterId',
        statusHeader: 'Comfirm Payment',
        statusNews: 'Payment sent successfully!',
        summary: [
          {
            header: 'Send To',
            details: [
              { 'Payee Name': this.creditAccountDetails?.customerName },
              {
                'Account No': this.selfTransferForm.get('payTo')?.value,
              },
              { 'Account Type': this.accountDetails?.accountType },
              { 'Bank Name': this.creditAccountDetails?.bankName },
              {
                Amount:
                  getCurrencySymbol(this.toAccount?.accountCurrency, 'narrow') +
                  this.selfTransferForm.get('amount')?.value,
              },
              { Remarks: this.selfTransferForm.get('remark')?.value },
            ],
          },
          {
            header: 'Send From',
            details: [
              { 'Payee Name': this.accountDetails?.customerName },
              { 'Account No': this.selfTransferForm.get('payFrom')?.value },
              {
                'Account Type': this.accountDetails?.accountType,
              },
            ],
          },
        ],
        qrToggle: false,
      },
    ];

    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      paymentDetailsArr,
      (payload) => this.selfService.saveSelfTranfer(payload),
    );
    this.router.navigate(['/user/send-money/payment-summary'], {});
  }

  payAccount(event: any) {
    const listOfAccounts = this.sessionStorageService.getListOfAccounts();
    this.accountType = listOfAccounts.find(
      (res) => res?.accountNo == event,
    )?.accountType;
    this.selectedCurrency = listOfAccounts.find(
      (res) => res?.accountNo == event,
    )?.accountCurrency;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
