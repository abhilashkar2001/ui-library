import { Component, OnInit } from "@angular/core";
import { LoanDashboardConstant } from "./loan-dashboard.constant";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-loan-dashboard",
  templateUrl: "./loan-dashboard.component.html",
  styleUrls: ["./loan-dashboard.component.scss"]
})
export class LoanDashboardComponent implements OnInit {
  selectedAccNo: any;
  isStatics: boolean = false;
  transactionCard = LoanDashboardConstant.transactionCard;
  closedLoanList = LoanDashboardConstant.closedLoan;  // Need to remove static api
  instantApprove = LoanDashboardConstant.instantApproveItems; // Need to remove static store
  //Need to remove static api
  loanDetails = [
    {
      accountType: "Business Loan",
      cbsAccountNumber: "1234567890"
    },
    {
      accountType: "Letter Of Credit (LOC)",
      cbsAccountNumber: "0987654321"
    }
  ];

  loanValues = [
    {
      label: "Next Instalment",
      value: "24-10-2394"
    },
    {
      label: "Next Instalment Date",
      value: "10April"
    },
    {
      label: "Outstanding Amount",
      value: "920930923"
    },
    {
      label: "Maturity Date",
      value: "232093"
    },
    {
      label: "Current rate of interest",
      value: "10%"
    }
  ];

  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

  route(path: string) {
    this.router.navigate([path]);
  }
}
