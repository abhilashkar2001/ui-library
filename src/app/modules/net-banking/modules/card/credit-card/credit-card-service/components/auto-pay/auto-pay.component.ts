import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountList } from 'app/shared/models/card.model';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { CardService } from '../../../../card.service';

@Component({
  selector: 'app-auto-pay',
  templateUrl: './auto-pay.component.html',
  styleUrls: ['./auto-pay.component.scss'],
})
export class AutoPayComponent implements OnInit {
  autoPayForm!: FormGroup;
  autoPayOptions: any[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  amountDueOptions: any[] = [
    { label: 'Total Due', value: 'totalDue' },
    { label: 'Minimum Due', value: 'minimumDue' },
  ];
  cardList: AccountList[] | any;
  typeofCard: string | any;
  currencyCode: string | any;
  profileInfo: any;
  accountDetails: AccountList | any;

  constructor(
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private sessionStorageService: SessionStorageService,
    private tokenService: TokenStorageService,
    private cardService: CardService,
  ) {
    this.profileInfo = this.tokenService.getUser();
    this.matIconRegistry.addSvgIcon(
      'info-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/svg/info_yellow.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.currencyCode = this.profileInfo?.branchCrncyCode;
    this.cardList = this.sessionStorageService.getListOfCards();
    this.buildAutoPayForm();
  }

  buildAutoPayForm() {
    this.autoPayForm = this.fb.group({
      source: ['I'],
      payFromAccountNo: [''],
      debitAmount: [''],
      debitCurrency: [''],
      creditAccount: [''],
      creditAmount: [''],
      creditCurrency: [''],
      cardNo: [''],
      autoPay: [''],
      amountDue: [''],
      totalDue: [false],
      maxAutoPayAmount: [''],
      cardId: [this.cardList?.[0]?.id || ''],
    });
  }

  payFromCurrencyCode(value: any) {
    this.autoPayForm?.get('debitCurrency')?.setValue(value);
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.cardList?.find(
      (card: any) => card?.cardNumber == account,
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
    }
  }

  proceed() {
    if (!this.autoPayForm?.valid) return;
    const payload = { ...this.autoPayForm.value };
    const paymentDetailsArr = [
      {
        eventType: 'mmidTransfer',
        operationType: 'Autopay',
        status: 'confirm',
        masterId: 'retailFundTransferMasterId',
        statusHeader: 'Comfirm Payment',
        statusNews: 'Auto Debit Credited!',
        summary: [
          {
            header: 'Card Control',
            details: [
              { 'Name on Card': this.accountDetails?.customerName },
              {
                'Card Number': this.accountDetails?.cardNumber,
              },
              {
                'Card Name': this.accountDetails?.cardName,
              },
              {
                'Credit Limit': this.accountDetails?.totalCreditLimit,
              },
            ],
          },
          {
            header: 'Payment Details',
            details: [
              { 'Payee Name': 'Kerala water' },
              {
                'Account Number': payload?.payFromAccountNo,
              },
              {
                'Account Type ': 'Saving Account',
              },
              {
                'Auto Pay Status': payload?.autoPay,
              },
              { 'Amount to be paid': payload?.amountDue },
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
      (payload) => this.cardService.saveAutoPayCreditPaymentDetails(payload),
      // Service call completion callback
    );
    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }
}
