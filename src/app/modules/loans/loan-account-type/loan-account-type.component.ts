import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { environment } from "environments/environment";
import { Location } from "@angular/common";
import * as moment from "moment";

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
  isShowCalculator: boolean = false;
  endPoints = environment.microServiceURL;
  selectedLoan: any;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private loanService: LoanService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    //   this.basisClass = this.activatedRoute.snapshot["queryParams"]["basisClass"];
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.basisClass = params.get("subClass");
    });
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
  getFileUrl(url) {
    if (url.includes("https")) {
      return "assets/images/normal_loan.svg";
    } else {
      return `${this.endPoints}${url}`;
    }
  }

  customApply(event) {
    console.log(event, ".....");
    this.subLoanList = event?.selectedLoan?.productDetails;
    this.isShowCalculator = event.isShowCalculator;
    this.basisClass = event.subClass;
  }

  goForCalculator(subAccount) {
    this.isShowCalculator = true;
    this.selectedLoan = subAccount;
    console.log(this.selectedLoan);
    const payload = JSON.stringify({
      processCycleCode: this.selectedLoan?.productDetails[0].processCycleCode,
      basisName: this.selectedLoan?.productDetails[0].basisName,
      basisId: this.selectedLoan?.productDetails[0].basisId,
    });
    sessionStorage.setItem("loanBasisDetails", payload);
  }
  customCalculatorValues(event) {
    this.selectedLoan = event;
    console.log(event);
    console.log(this.selectedLoan);
    const payload = {
      emiAmount: parseInt(this.selectedLoan.amount),
      interestRate: parseInt(this.selectedLoan.interestRate),
      interestPayable: 5500,
      principalAmount: 7000,
      totalPayableAmount: 12500,
      disbursementType: "",
      accountNumber: null,
      emiStartDate: moment(new Date()).format(),
      // originationId: 9821,
    };
    this.loanService.submitLoanDetail(payload).subscribe((resp) => {
      if (resp?.statusCode === 201) {
        sessionStorage.removeItem("loanstep");
        sessionStorage.setItem("loanDisburseId", resp?.data.id);
        const url = this.location.prepareExternalUrl(
          this.router.serializeUrl(
            this.router.createUrlTree(["/loan/create-loan"])
          )
        );
        window.open(`${url}`, "_blank");
      }
    });
  }
}
