import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CibilScorePoorDialgComponent } from '../cibil-score-poor-dialg/cibil-score-poor-dialg.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';

@Component({
  selector: 'app-cibil-score-result',
  templateUrl: './cibil-score-result.component.html',
  styleUrls: ['./cibil-score-result.component.scss'],
})
export class CibilScoreResultComponent implements OnInit {
  dialogsaveRef!: MatDialogRef<CibilScorePoorDialgComponent>;
  @Input() flow: string | any;
  @Input() isDifferentMobile: boolean | any;
  @Input() isButtonRequired: boolean | any = true;
  @Output() backEvent = new EventEmitter<Data>();
  // @Output() onBackFromCIBILscoreResult: EventEmitter<any> = new EventEmitter();
  @Output() cibilConfirmEvent: EventEmitter<any> = new EventEmitter();
  cibilScore = 689;
  dataSource: any;
  cibilScoreList = [
    {
      score: 'Below 681',
      description: 'Need Help',
      colorCode: '#D57066',
    },
    {
      score: '681 - 730',
      description: 'Average',
      colorCode: '#DF9690',
    },
    {
      score: '771 - 770',
      description: 'Fair',
      colorCode: '#E4A037',
    },
    {
      score: '771 - 790',
      description: 'Good',
      colorCode: '#62BB69',
    },
    {
      score: 'Above 791',
      description: 'Excellent',
      colorCode: '#D57066',
    },
  ];

  constructor() {
    this.dataSource = {
      chart: {
        // caption: "Your CIBIL Score is",
        // "subcaption": "Last week",
        // "lowerLimit": "0",
        // "upperLimit": "900",
        showToolTip: '0',
        theme: 'fusion',
      },
      colorRange: {
        color: [
          {
            minValue: '0',
            maxValue: '681',
            code: '#ff0000',
          },
          {
            minValue: '682',
            maxValue: '730',
            code: '#f78e8e',
          },
          {
            minValue: '731',
            maxValue: '770',
            code: '#ffa600',
          },
          {
            minValue: '771',
            maxValue: '790',
            code: '#21ac21',
          },
          {
            minValue: '791',
            maxValue: '900',
            code: '#006400',
          },
        ],
      },
      dials: {
        dial: [
          {
            value: '695',
          },
        ],
      },
    };
  }

  ngOnInit(): void {
    this.cibilScore = this.getCibliScore();
    this.dataSource.dials.dial[0]['value'] = this.cibilScore;
  }

  getCibliScore() {
    return 700;
  }

  onBack() {
    this.backEvent.emit();
  }

  onContinue() {
    this.cibilConfirmEvent.emit({ isNext: true });
  }
}
