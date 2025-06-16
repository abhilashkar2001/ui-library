import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OfferIssueService } from 'app/shared/services/offer-issue.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { selectUser, User } from '@onerumango/utils';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-process-offer-letter',
  templateUrl: './process-offer-letter.component.html',
  styleUrls: ['./process-offer-letter.component.scss'],
})
export class ProcessOfferLetterComponent implements OnInit, OnDestroy {
  currentUser: any;
  currentTab: any;
  revisiteForm!: FormGroup;
  originationId: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private offerIssueService: OfferIssueService,
    private route: Router,
    private store: Store,
    private sessionStorageService: SessionStorageService,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.buildRevisiteForm();
    (this.originationId = this.sessionStorageService.getOriginationId()),
      this.fetchOfferDetails();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
