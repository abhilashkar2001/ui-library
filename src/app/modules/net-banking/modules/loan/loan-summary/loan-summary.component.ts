import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoanDashboardConstant } from "../loan-dashboard/loan-dashboard.constant";
import { LoanSummaryStore } from "./loan-summary.store";
import { LoanService } from "app/shared/services/net-loan-service/loan.service";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { LoanDetailsModel } from "app/shared/models/loan-details.model";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-loan-summary",
  templateUrl: "./loan-summary.component.html",
  styleUrls: ["./loan-summary.component.scss"]
})
export class LoanSummaryComponent implements OnInit {
  summaryForm: FormGroup | undefined;
  customerDetails: any = LoanSummaryStore.customerDetails;
  summaryDetails: any;
  loanInfo = LoanSummaryStore.loanInfo;
  transactionCard = LoanDashboardConstant.transactionCard;
  // currentTab$: BehaviorSubject<number> = new BehaviorSubject(1);
  selectedRecentTab: any;
  chartData: any;

  //need to remove the static data
  loanDetails: any[] | any;

  Repayment = LoanSummaryStore.RepaymentDetails;
  Disbursed = LoanSummaryStore.DisbursedDetails;
  Tenure = LoanSummaryStore.TenureDetails;
  chartDetails: any;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo();
    console.log(this.loanDetails, "checkk");

    this.fetchSummaryDetails(this.loanDetails[0]?.cbsAccountNumber);
    this.buildSummary();
  }

  buildSummary() {
    this.summaryForm = this.fb.group({
      loanAccountNumber: [""]
    });
    this.summaryForm
      ?.get("loanAccountNumber")
      ?.setValue(this.loanDetails[0]?.cbsAccountNumber);
  }

  //to fetch summary details
  fetchSummaryDetails(loanaccNo: any) {
    console.log(loanaccNo, "chekkk");
    this.loanService
      .fetchLoanSummary(loanaccNo)
      .subscribe((res: IcHttpResponseModel<LoanDetailsModel> | any) => {
        if (res?.statusCode == 200 && res?.data) {
          this.summaryDetails = res?.data;
          this.changeRecentTransTabs(0);
        }
      });
  }

  changeRecentTransTabs(i: any) {
    this.selectedRecentTab = this.loanInfo[i];
    let chartClone = LoanSummaryStore.chartData;
    if (i == 0) {
      this.chartDetails = this.Tenure;
      this.chartData = {
        ...chartClone,
        id: 567,
        data: [
          {
            name: "Tenure",
            colorByPoint: true,
            innerSize: "45%",
            data: [
              {
                name: "Total Tenure",
                y: this.summaryDetails?.totalTenure
              },
              {
                name: "Remaining Tenure",
                y: this.summaryDetails?.remTenure
              }
            ]
          }
        ],
        legend: {
          enabled: true
        },
        xAxis: {
          lineColor: "#DEDEDE"
        }
      };
    } else if (i == 1) {
      this.chartDetails = this.Disbursed;
      this.chartData = {
        ...chartClone,
        chart: {
          type: "column"
        },
        id: 6556,
        colors: ["#377DFF1D", "#606C8D", "#00205C"],
        data: [
          {
            name: "Disbursed",
            colorByPoint: true,
            legend: {
              enabled: true
            },
            data: [
              {
                name: "Total sanction",
                y: this.summaryDetails?.totalSanctionAmt
              },
              {
                name: "Total Disbursed",
                y: this.summaryDetails?.totalDisbursedAmt
              },
              {
                name: "Remaining Disbursed",
                y: this.summaryDetails?.remainingDisbursed
              }
            ]
          }
        ],
        xAxis: {
          type: "category"
        }
      };
    } else if (i == 2) {
      this.chartDetails = this.Repayment;
      this.chartData = {
        ...chartClone,
        id: 132,
        data: [
          {
            name: "Tenure",
            colorByPoint: true,
            innerSize: "45%",
            data: [
              {
                name: "Outstanding Amount",
                y: this.summaryDetails?.outstandingAmt
              },
              {
                name: "Re-paid Till Date",
                y: this.summaryDetails?.repaidAmt
              }
            ]
          }
        ],
        legend: {
          enabled: true
        }
      };
    }
  }

  getId() {
    return "dynamicChart";
  }
}
