import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";

@Component({
  selector: "app-loan-account-type",
  templateUrl: "./loan-account-type.component.html",
  styleUrls: ["./loan-account-type.component.scss"],
})
export class LoanAccountTypeComponent implements OnInit {
  loanType: string = "Personal";
  selectedCalculator: boolean;
  basisClass: string;
  subLoanList: any = [];

  constructor(
    private router: Router,
    private commonService: CommonService,
    private loanService: LoanService,
    private activatedRoute: ActivatedRoute
  ) {
    this.basisClass = this.activatedRoute.snapshot["queryParams"]["basisClass"];
  }

  ngOnInit(): void {
    //please dont'remove from here
    this.updateCurrentRoute();
    this.getLoanSubTypes();
  }

  getLoanSubTypes() {
    this.loanService
      .getSubLoanTypes(this.basisClass)
      .subscribe((response: any) => {
        this.subLoanList = response.data;
      });
  }

  updateCurrentRoute() {
    this.commonService.updateData(this.router.url.split("?")[0]);
  }

  onSelect() {
    this.selectedCalculator = !this.selectedCalculator;
  }

  loanCalculatorsData(event: any) {
    this.commonService.loanCalculatorsDataSave(event);
  }
}
