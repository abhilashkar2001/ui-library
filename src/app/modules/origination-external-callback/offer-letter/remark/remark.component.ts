import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferIssueService } from 'app/shared/services/offer-issue.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { selectUser } from '@onerumango/utils';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-remark',
  templateUrl: './remark.component.html',
  styleUrls: ['./remark.component.scss'],
})
export class RemarkComponent implements OnInit, OnDestroy {
  currentuser: any;
  originationId: any;
  revisiteForm!: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private offerIssueService: OfferIssueService,
    private fb: FormBuilder,
    private route: Router,
    private sessionStorageService: SessionStorageService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    const loadUser$ = this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.currentuser = user;
        this.buildRevisiteForm();
        this.fetchOfferDetails();
      }
    });

    this.subscriptions.push(loadUser$);
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

  fetchOfferDetails() {
    this.offerIssueService
      .fetchOfferIssueSummary(this.originationId)
      .subscribe((res: any) => {
        if (res?.statusCode == 200 && res?.data) {
          this.buildRevisiteForm(res?.data[0]);
        }
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

  /**Reseting the remarks data */
  resetRemark() {
    this.revisiteForm.get('remark')?.reset();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
