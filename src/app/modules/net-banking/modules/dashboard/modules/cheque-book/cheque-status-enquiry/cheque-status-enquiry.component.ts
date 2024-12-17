import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChequeStore } from '../cheque.store';
import { ChequeService } from '../cheque-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cheque-status-enquiry',
  templateUrl: './cheque-status-enquiry.component.html',
  styleUrls: ['./cheque-status-enquiry.component.scss'],
})
export class ChequeStatusEnquiryComponent implements OnInit {
  chequeStatusCols = ChequeStore.recentColumns;
  chequeStatusData: any[] | any = [];
  chqueInquiryForm!: FormGroup;

  customerInfo: any;
  accountNumberList: any[] = [];

  chequeNumber: any;

  inquiryChequeOptions: any[] = [
    { label: 'Number', value: 'Number' },
    { label: 'Range', value: 'Range' },
    { label: 'Status', value: 'Status' },
  ];
  selectList: any[] = [
    { label: 'Not Used', value: 'N' },
    { label: 'Used', value: 'Yes' },
  ];

  fetchedData: any;

  constructor(
    private fb: FormBuilder,
    private chequeService: ChequeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchCustomerInfo();
    this.buildForm();
  }

  fetchCustomerInfo() {
    this.accountNumberList = JSON.parse(
      <string>sessionStorage.getItem('listOfAccounts'),
    );
  }

  buildForm() {
    this.chqueInquiryForm = this.fb.group({
      accountNo: [''],
      inquiryChequeBy: ['Number'],
      fromChequeBookNo: [''],
      toChequeBookNo: [''],
      chequeNumber: [''],
      select: [''],
    });
    const selectedAccountNo = sessionStorage.getItem('selectAccNo');

    if (selectedAccountNo) {
      this.chqueInquiryForm.get('accountNo')?.setValue(selectedAccountNo);
      this.handleAccountNumberChange();
    }
  }

  handleAccountNumberChange() {
    this.chequeService
      .getChequeNoByAccNo(this.chqueInquiryForm.get('accountNo')?.value)
      .subscribe(
        (resp) => {
          this.chequeNumber = resp?.data;
        },
        (err) => console.error('Error: ', err),
      );
  }

  goBack() {
    this.router.navigate(['/user/dashboard']);
  }

  fetchChequeDetails() {
    const chqueInquiryValue = this.chqueInquiryForm.value;
    const payload = {
      inquiryChequeBy: chqueInquiryValue?.inquiryChequeBy,
      page: 1,
      size: 5,
      fromChequeBookNo: chqueInquiryValue?.fromChequeBookNo,
      toChequeBookNo: chqueInquiryValue?.toChequeBookNo,
      accountNo: chqueInquiryValue?.accountNo,
      chequeBookNumber: chqueInquiryValue?.chequeNumber,
      status: chqueInquiryValue?.select,
    };

    this.chequeService.inquiryCheque(payload)?.subscribe(
      (resp) => {
        console.log(resp);
        this.fetchedData = resp?.data;

        this.chequeStatusData =
          Array.isArray(this.fetchedData) &&
          this.fetchedData?.map((i) => ({
            chequeNumber: i.leavesNumber,
            status: i?.status,
            reason: i?.reason,
            amount: i?.amount,
          }));
      },
      (error) => {
        console.error('Error: ', error);
      },
    );
  }
}
