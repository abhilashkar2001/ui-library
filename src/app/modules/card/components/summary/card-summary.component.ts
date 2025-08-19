import { Component, OnInit } from '@angular/core';
import { documentResp } from 'app/modules/card/components/summary/document.response';
import {
  FlowType,
  SummaryCardStore,
} from 'app/modules/card/components/summary/summary.store';
import { LoanService } from 'app/shared/services/loan/loan.service';

@Component({
  selector: 'app-card-summary',
  templateUrl: './card-summary.component.html',
  styleUrls: ['./card-summary.component.scss'],
})
export class CardSummaryComponent implements OnInit {
  flowType: FlowType = FlowType.CommonCardSummaryFlow;
  sectionKeys: any = SummaryCardStore.flowSections[this.flowType];
  sectionsToDisplay: any[] = [];
  originationId: number | undefined = 4063;
  documentSummary: any = documentResp.data;
  constructor(private cardService: LoanService) {}
  ngOnInit(): void {
    this.sectionsToDisplay = this.sectionKeys.map((key: string) => ({
      ...SummaryCardStore.sections[key],
      values: {},
    }));

    this.fetchWebSummary();
    // this.fetchCheckListDocument();
  }
  fetchWebSummary() {}
  fetchCheckListDocument() {
    if (!this.originationId) return;
    this.cardService
      .fetchCheckListSummary(this.originationId)
      .subscribe((res: any) => {
        if (res?.statusCode === 200 || res?.statusCode === 201)
          this.documentSummary = res?.data;
      });
  }
}
