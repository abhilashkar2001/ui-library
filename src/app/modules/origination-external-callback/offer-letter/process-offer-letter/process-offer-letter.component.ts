import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferIssueService } from 'app/shared/services/offer-issue.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-process-offer-letter',
  templateUrl: './process-offer-letter.component.html',
  styleUrls: ['./process-offer-letter.component.scss'],
})
export class ProcessOfferLetterComponent implements OnInit {
  currentUser: any;
  currentTab: any;
  revisiteForm!: FormGroup;
  originationId: any;
  constructor(
    private tokenStorageService: TokenStorageService,
    private fb: FormBuilder,
    private offerIssueService: OfferIssueService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.buildRevisiteForm();
    this.originationId = JSON.parse(
      <string>sessionStorage.getItem('originationId'),
    );
    this.fetchOfferDetails();
  }

  buildRevisiteForm(data?: any) {
    this.revisiteForm = this.fb.group({
      id: [data?.id ?? ''],
      amount: [data?.approvedLoanAmount ?? ''],
      rateOfInterest: [data?.rateOfInterest ?? ''],
      loanTenureDay: [data?.loanTenurDay ?? ''],
      loanTenureMonth: [data?.loanTenurMonth ?? ''],
      loanTenureYear: [data?.loanTenurYear ?? ''],
      requestedAmount: [''],
      requestedRateOfInterest: [''],
      requestedLoanTenureDay: [''],
      requestedLoanTenureMonth: [''],
      requestedLoanTenureYear: [''],
      remark: [],
    });
  }

  saveCustomerRequest() {
    const formValue = this.revisiteForm.value;
    const payload: any = {};
    payload.loanAmount = formValue.requestedAmount;
    payload.rateOfInterest = formValue.requestedRateOfInterest;
    payload.loanTenureMonth = formValue.requestedLoanTenureMonth;
    payload.loanTenureYear = formValue.requestedLoanTenureYear;
    payload.loanTenureDay = formValue.requestedLoanTenureDay;
    payload.remarks = formValue.remarks;
    payload.date = moment(new Date()).format('DD-MMM-YYYY');
    payload.originationId = this.originationId;
    payload.id = formValue.id;
    this.offerIssueService.saveCustomerRequest(payload).subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.route.navigate(['home']);
      }
    });
  }

  fetchOfferDetails() {
    this.offerIssueService
      .fetchOfferIssueSummary(this.originationId)
      .subscribe((res: any) => {
        if (res?.statusCode == 200 && res?.data) {
          this.buildRevisiteForm(res?.data[0]);
        }
      });
  }

  /**This function is for reset the formvalues */
  reset() {
    this.revisiteForm.reset();
  }
}
