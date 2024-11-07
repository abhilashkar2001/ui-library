import { Component, OnInit } from "@angular/core";
import { LoanDashboardConstant } from "./loan-dashboard.constant";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { LoanService } from "app/shared/services/net-loan-service/loan.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { Account, LoanAccount, LoanAccounts } from "app/shared/models/loan-account.model";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";

@Component({
  selector: "app-loan-dashboard",
  templateUrl: "./loan-dashboard.component.html",
  styleUrls: ["./loan-dashboard.component.scss"]
})
export class LoanDashboardComponent implements OnInit {
  selectedAccNo: any;
  isStatics: boolean = false;
  transactionCard = LoanDashboardConstant.transactionCard;
  recentTransTabs = LoanDashboardConstant.recentTabs;
  recentTransCols = LoanDashboardConstant.recentColumns;
  recentTransData: any;
  closedLoanList = LoanDashboardConstant.closedLoan;  // Need to remove static api
  instantApprove = LoanDashboardConstant.instantApproveItems; // Need to remove static store
  loanDetails: LoanAccounts;
  loanValues = [
    {
      label: "Next Instalment",
      value: "nextInstallmentAmount"
    },
    {
      label: "Next Instalment Date",
      value: "nextInstallmentDate"
    },
    {
      label: "Outstanding Amount",
      value: "outstandingAmount"
    },
    {
      label: "Maturity Date",
      value: "maturityDate"
    },
    {
      label: "Current rate of interest",
      value: "currentInterestRate"
    }
  ];
  corpCustId: any;
  loanDetailsAccountData: any

  constructor(private location: Location, private router: Router, private loanService: LoanService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.corpCustId = this.sessionService.getCustomerInfo()?.customerId
    this.fetchListOfCorpLoanNo()
    this.fetchCorpLoanDetails()
  }

  /**fetch corpLoandetails of dashboard */
  fetchCorpLoanDetails() {
    this.loanService.fetchCorpLoanDetails(this.corpCustId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.loanDetails = res?.data;
        this.sessionService.setLoanInfo(this.loanDetails);
      }
    })
  }

  /**
   * This method is for fetch the list of only loanaccount number and storing in sessionstorage
   */

  fetchListOfCorpLoanNo() {
    this.loanService.fetchListofCorpAccountDetails(this.corpCustId).subscribe((res: IcHttpResponseModel<any>) => {
      if (res?.statusCode == 200) {
        this.loanDetailsAccountData = res?.data?.accounts
          ?.filter((account: LoanAccount) => account.type === 'Accounts')
          ?.flatMap((account: LoanAccount) =>
            account.accountList.map((acc: Account) => ({
              ...acc,
              accountType: account.accountType
            }))
          )
        this.sessionService.setListOfAccounts(this.loanDetailsAccountData)
      }
    })
  }

  goBack() {
    this.location.back();
  }

  route(path: string) {
    this.router.navigate([path]);
  }
}