import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartStore } from '../chart/chart.store';

@Component({
  selector: 'app-maturity-chart',
  templateUrl: './maturity-chart.component.html',
  styleUrls: ['./maturity-chart.component.scss'],
})
export class MaturityChartComponent implements OnInit {
  @Input() chartData: any;
  @Input() chartSectionDetails: any;
  @Input() autoCheck: any;
  @Input() buttonData: any;
  @Input() labelOne: string | any;
  @Input() labelTwo: string | any;
  @Input() data: any;
  @Input() loanDetailsSection = false;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancle: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnChanges(): void {
    const interest = this.data?.maturityAmount - this.data?.depositAmount;
    const chartClone = ChartStore.chartData;
    this.chartData = {
      ...chartClone,
      id: 1002,
      data: [
        {
          name: this.labelOne ?? 'Interest',
          data: [0, interest],
        },
        {
          name: this.labelTwo ?? 'Deposit Amount',
          data: [this.data?.depositAmount, this.data?.depositAmount],
        },
      ],

      xAxis: {
        labels: {
          enabled: false,
        },
        categories: ['', ''],
        lineColor: '#DEDEDE',
      },
      colors: ['#00205C', '#FFFFFF'],
    };
  }

  ngOnInit(): void {}
}
