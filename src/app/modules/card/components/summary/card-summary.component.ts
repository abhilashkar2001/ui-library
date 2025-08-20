import { Component, OnInit } from '@angular/core';
import {
  FlowType,
  SummaryCardStore,
} from 'app/modules/card/components/summary/summary.store';

@Component({
  selector: 'app-card-summary',
  templateUrl: './card-summary.component.html',
  styleUrls: ['./card-summary.component.scss'],
})
export class CardSummaryComponent implements OnInit {
  flowType: FlowType = FlowType.DebitCardNew;
  sectionKeys: any = SummaryCardStore.flowSections[this.flowType];
  sectionsToDisplay: any[] = [];
  ngOnInit(): void {
    this.sectionsToDisplay = this.sectionKeys.map((key: string) => ({
      ...SummaryCardStore.sections[key],
      values: {},
    }));

    this.fetchWebSummary();
  }
  fetchWebSummary() {}
}
