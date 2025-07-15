import { Component, OnInit } from '@angular/core';
import { SummaryStore } from './summary.store';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class AccountSummaryComponent implements OnInit {
  accountDetailsStore: any;
  collateralHeaders = SummaryStore.collateralHeaders;
  directorData = SummaryStore.directorDetailsStore;
  summary: any;
  documentData: any;
  originationId: number | undefined;
  basisClass!: string | null;

  constructor(
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
  ) {
    this.basisClass = this.sessionStorageService.getItem('basisClass');
    this.accountDetailsStore =
      this.basisClass == 'CURRENT ACCOUNT'
        ? SummaryStore.AccountDetailsStore
        : SummaryStore.CorporateAccountDetailsStore;
  }

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.fetchSummary();
    this.fetchCheckListDocument();
  }

  fetchSummary() {
    this.loanService
      .getLoanSummary(this.originationId)
      .subscribe((res: any) => {
        if (res?.statusCode === 200 || res?.statusCode === 201)
          this.summary = res?.data;
      });
  }

  fetchCheckListDocument() {
    if (this.originationId)
      this.loanService
        .fetchCheckListSummary(this.originationId)
        .subscribe((res: any) => {
          if (res?.statusCode === 200 || res?.statusCode === 201)
            this.documentData = res?.data;
        });
  }
}
