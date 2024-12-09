import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";
import * as Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsSolidGauge from "highcharts/modules/solid-gauge";
import HighchartsSunburst from "highcharts/modules/sunburst";
import HighchartsFunnel3D from "highcharts/modules/funnel3d";
import highcharts3d from "highcharts/highcharts-3d";
import cylinder from "highcharts/modules/cylinder";
import Pyramid3D from "highcharts/modules/pyramid3d";
import Variablepie from "highcharts/modules/variable-pie";
import noData from "highcharts/modules/no-data-to-display";
import { FormBuilder, FormGroup } from "@angular/forms";
import Drilldown from "highcharts/modules/drilldown";
noData(Highcharts);

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
HighchartsSunburst(Highcharts);
highcharts3d(Highcharts);
HighchartsFunnel3D(Highcharts);
cylinder(Highcharts);
Pyramid3D(Highcharts);
Variablepie(Highcharts);
Drilldown(Highcharts);

@Component({
  selector: "app-chart",
  templateUrl: "./chart.page.html",
  styleUrls: ["./chart.page.scss"]
})

//  constructor(private chartService: ChartService) {}
export class ChartPage implements OnInit {
  @ViewChild("charts") public chartEl: ElementRef | any;
  @Output() customThreeDView = new EventEmitter<any>();
  constructor(private fb: FormBuilder) {}
  chartId = "charts190";
  chart: any;
  @Input() chartData: any;
  @Input() dynamicCharData: any;
  @Input() customId: any;
  @Input() chartTitle = "";
  @Input() chartMenuList: any;
  chartForm!: FormGroup;
  DEFAULT_RANGE_TYPE = "2024";
  // @Input() dateRange = ["Yearly", "Monthly"];
  rangeSelectorRequired: any;
  CURRENT_YEAR: any = new Date().getFullYear();
  CURRENT_MONTH = new Date().getMonth() + 1;
  CURRENT_DATE = new Date();
  years: number[] | any;
  yearItems: number[] = this.generateYears();
  @Input() showField = false;
  @Output() customDateOutput = new EventEmitter<any>();
  ngOnInit() {
    this.years = Array.from(
      { length: 10 },
      (_, i) => new Date().getFullYear() - i
    );
    this.buildChartForm();
    this.rangeSelectorRequired = this.dynamicCharData?.rangeSelectorRequired;
  }
  buildChartForm() {
    this.chartForm = this.fb.group({
      yearItems: [this.DEFAULT_RANGE_TYPE ?? null],
      year: [this.CURRENT_YEAR ?? null],
      month: [this.CURRENT_MONTH ?? null],
      date: [this.CURRENT_DATE ?? null]
    });
    this.emitDateOutput("dateRange");
  }

  generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
    return years;
  }

  ngOnChanges(changes: SimpleChanges | any) {
    console.log(changes, "changes");
    if (changes.dynamicCharData) {
      this.dynamicCharData = {
        id: changes.dynamicCharData.currentValue?.id,
        rangeSelectorRequired:
          changes.dynamicCharData.currentValue?.rangeSelectorRequired,
        chart: changes.dynamicCharData.currentValue.chart ?? {
          backgroundColor: "#f3f3f3",
          zoomType: "xy",
          options3d: {
            enabled: true
          }
        },
        title: {},
        subtitle: {
          text:
            "Source: " +
            '<a href="https://www.yr.no/nb/historikk/graf/5-97251/Norge/Troms%20og%20Finnmark/Karasjok/Karasjok?q=2021"' +
            'target="_blank">YR</a>',
          align: "left"
        },
        xAxis: changes.dynamicCharData.currentValue.xAxis ?? {},
        yAxis: changes.dynamicCharData.currentValue.yAxis ?? {},
        tooltip: changes.dynamicCharData.currentValue?.tooltip ?? {
          shared: true
        },
        legend: changes.dynamicCharData.currentValue?.legend ?? {},
        series: changes.dynamicCharData.currentValue.data,
        drilldown: changes.dynamicCharData.currentValue?.drilldown ?? {},
        plotOptions: changes.dynamicCharData.currentValue?.plotOptions ?? {},
        pane: changes.dynamicCharData.currentValue?.pane ?? {},
        colors: changes.dynamicCharData.currentValue?.colors
          ? changes.dynamicCharData.currentValue.colors
          : [
              "#2aa7f2",
              "#504bbc",
              "#1acd1a",
              "#f26533",
              "#6683b3",
              "#cb63ef",
              "#2ee0ca",
              "#fb7670",
              "#feb56a",
              "#91e8e1",
              "#ff5733",
              "#8a2be2",
              "#ffd700",
              "#00ffff",
              "#ff00ff"
            ]
      };
    }
    if (changes.dynamicCharData.currentValue.colors) {
      // delete this.dynamicCharData.colors;
      console.log("this.dynamicCharData", this.dynamicCharData);
    }
    console.log("this.dynamicCharData", this.dynamicCharData);
    setTimeout(() => {
      this.createChartGauge(this.dynamicCharData);
    }, 200);

    if (changes?.customId) {
      this.customId = changes?.customId.currentValue;
    }
  }
  updatChart(data: any) {
    let modifiedData = this.setColor(data);
    let chart = Highcharts.chart(`charts${data?.id}`, modifiedData);
    this.checkNoData(modifiedData, chart);
  }
  showNoData(): void {
    Highcharts.setOptions({
      chart: {
        backgroundColor: "#f3f3f3"
      },
      lang: {
        noData: "No Data Avialable"
      },
      noData: {
        style: {
          color: "red"
        }
      }
    });
  }

  setColor(data: any) {
    data.colors = [
      "#2aa7f2",
      "#504bbc",
      "#00d76d",
      "#f26533",
      "#6683b3",
      "#cb63ef",
      "#2ee0ca",
      "#fb7670",
      "#feb56a",
      "#91e8e1",
      "#ff5733",
      "#8a2be2",
      "#ffd700",
      "#00ffff",
      "#ff00ff"
    ];

    return data;
  }

  createChartGauge(data: any) {
    // let modifiedData = this.setColor(data);
    this.chart = Highcharts.chart(`charts${data?.id}`, data);
    //  this.checkNoData(modifiedData, this.chart);
  }

  checkNoData(data: any, chart: any) {
    if (data.series[0].data?.length == 0) {
      this.showNoData();
      chart.update(data);
    } else {
      chart.update(data);
    }
  }
  getId() {
    return `charts${this.dynamicCharData?.id}`;
  }
  threedView(view: any) {
    this.customThreeDView.emit(view);
  }
  onStartDateChange() {}
  onMonthChange() {}
  onYearChange() {}
  dateRangeChange() {}

  emitDateOutput(action: any) {
    this.customDateOutput.emit({
      data: this.chartForm.value,
      type: action
    });
  }
}
