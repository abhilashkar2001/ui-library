import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoanDetailsModel } from "app/shared/models/loan-details.model";
import { loanServiceStore } from "../../../loan-tabs";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { LoanService } from "app/shared/services/net-loan-service/loan.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-repayment-schedule",
  templateUrl: "./repayment-schedule.component.html",
  styleUrls: ["./repayment-schedule.component.scss"],
})
export class RepaymentScheduleComponent implements OnInit {
  repaymentScheduleForm: FormGroup | undefined;
  fetchStatement: boolean = false;
  loanDetails: LoanDetailsModel[];
  loanAccountDetails = loanServiceStore.repaymentScheduleDetails;
  repaymentDetails: any;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo();
    this.buildDisbursementScheduleForm();
  }

  buildDisbursementScheduleForm() {
    this.repaymentScheduleForm = this.fb.group({
      loanAccNo: [""],
    });
    this.repaymentScheduleForm
      .get("loanAccNo")
      .setValue(this.loanDetails[0]?.cbsAccountNumber);
  }

  //fetch details of repayment schedule
  fetchRepaymentSchedule() {
    this.fetchStatement = true;
    this.loanService
      .fetchRepaymentSchedule(this.repaymentScheduleForm.value.loanAccNo)
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode == 200 && res?.data)
          this.repaymentDetails = res?.data;
      });
  }
}
