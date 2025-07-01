import { Component, OnInit } from '@angular/core';
import { SummaryStore } from './summary.store';
import { LoanService } from 'app/shared/services/loan/loan.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  loanDetailsStore = SummaryStore.loanDetailsStore;
  collateralHeaders = SummaryStore.collateralHeaders;
  tableData = SummaryStore.tableData;
  summary: any;

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.fetchSummary();
  }

  fetchSummary() {
    this.loanService.getLoanSummary(314).subscribe((res: any) => {
      this.summary = res?.data;
    });
  }
}
