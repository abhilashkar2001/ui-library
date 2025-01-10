import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() paymentDetails: any;
  @Input() status: string | any;
  operationType: string | any;
  @Input() response: any;
  docCol = [
    {
      headerDef: 'documentName',
      headerCell: 'Document Name',
    },
    {
      headerDef: 'documentNumber',
      headerCell: 'Document Number',
    },
    {
      headerDef: 'fileUpload',
      headerCell: 'File Upload',
    },
    {
      headerDef: 'addressProof',
      headerCell: 'Address Proof',
    },
    {
      headerDef: 'primary',
      headerCell: 'Primary',
    },
  ];

  paymentDetailsArr: any = [
    {
      eventType: 'addPayee',
      operationType: 'Transfer_Money',
      masterId: 'benificiaryMasterId',
      retailBeneficiaryMasterId: 1234,

      // status: "confirm",
      // statusHeader: "Comfirm Details",
      // statusNews: "",
      status: 'success',
      statusHeader: 'Payee Details',
      statusNews: 'Payee Added successfully!',
      // status: "failed",
      // statusHeader: "Payee Details",
      // statusNews: "Payee Adding failed!",
      refNo: 'R10034',
      payerDetails: {
        payerName: 'Srihari.G',
        accountNo: '9872627',
        bank: 'WBC',
      },
      summary: [
        {
          header: 'Payee Details',
          details: [
            { Name: 'Prem' },
            { 'Account No': '8726327867678' },
            { 'Confirm Account Number': '8726327867678' },
            { 'Account Branch': 'Whitefield' },
            { 'Bank Code': 'HDFC78566' },
            { 'Nick Name': 'Sri' },
            { 'Mobile No': '87876789890' },
            { 'Email ID': 'Sri@gmail.com' },
          ],
        },
        {
          header: 'Send To',
          details: [
            { Name: 'Prem' },
            { 'Account No': '8726327867678' },
            { 'Confirm Account Number': '8726327867678' },
            { 'Account Branch': 'Whitefield' },
            { 'Bank Code': 'HDFC78566' },
            { 'Nick Name': 'Sri' },
            { 'Mobile No': '87876789890' },
            { 'Email ID': 'Sri@gmail.com' },
          ],
        },
        {
          header: 'Send From',
          details: [
            { Name: 'Prem' },
            { 'Account No': '8726327867678' },
            { 'Confirm Account Number': '8726327867678' },
            { 'Account Branch': 'Whitefield' },
            { 'Bank Code': 'HDFC78566' },
            { 'Nick Name': 'Sri' },
            { 'Mobile No': '87876789890' },
            { 'Email ID': 'Sri@gmail.com' },
          ],
        },
      ],
      qrToggle: true,
    },
  ];
  download: Blob | any;
  key: string | any;
  masterId: any;
  customerInfo: any;
  profileInfo: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private location: Location,
    private store: Store,
    private sessionStorageService: SessionStorageService,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.matIconRegistry.addSvgIcon(
      'edit-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/edit_pen.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'info-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/info_yellow.svg',
      ),
    );
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes) {
      if (changes?.status?.currentValue) {
        this.paymentDetailsArr[0].status = changes.status.currentValue;
        console.log(this.paymentDetailsArr[0].status);
      }
    }
  }

  ngOnInit(): void {
    this.paymentDetailsArr = this.paymentDetails;
    this.loadUserProfile();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  done() {
    this.router.navigate(['user/dashboard']);
  }
  edit() {
    this.location.back();
  }
  back() {
    this.location.back();
  }

  pay() {
    this.router.navigate(['/send-money/dashboard/transfer-money'], {
      state: { paymentDetails: this.paymentDetails },
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
