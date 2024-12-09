import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { LoanDetailsModel } from "app/shared/models/loan-details.model";
import { LoanInstallmentModel } from "app/shared/models/loan-installment.model";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { GenericValueService } from "app/shared/services/generic-value.service";
import { LoanService } from "app/shared/services/net-loan-service/loan.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-repayment-cycle",
  templateUrl: "./repayment-cycle.component.html",
  styleUrls: ["./repayment-cycle.component.scss"]
})
export class RepaymentCycleComponent implements OnInit {
  repaymentCycleForm: FormGroup | any;
  loanDetails: LoanDetailsModel[] | any;
  installmentDetails: LoanInstallmentModel | any;
  genericValue: any = { REQUESTEDREPAYMENTCYCLE: [] };

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private loanService: LoanService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
    private genericValueService: GenericValueService
  ) {}

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo();
    this.buildRepaymentCycleForm();
    this.fetchGenericValues();
  }

  //fetch generic values
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue("Common", Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k])
          );
        }
      });
  }

  buildRepaymentCycleForm() {
    this.repaymentCycleForm = this.fb.group({
      debitAccount: [""],
      debitCurrency: [""],
      currentRepayment: [""],
      repayRequest: [""],
      transferType: "Repayment Cycle"
    });
    this.repaymentCycleForm
      ?.get("debitAccount")
      ?.setValue(this.loanDetails?.[0]?.cbsAccountNumber);
    this.fetchCurrentRepaymentCycle();
  }

  //fetch current repayment cycle
  fetchCurrentRepaymentCycle() {
    this.loanService
      .fetchCurrentRepaymentCycle(this.repaymentCycleForm.value.debitAccount)
      .subscribe((res: IcHttpResponseModel<any> | any) => {
        if (res?.statusCode == 200 && res?.data) {
          let repaymentCycle = res?.data?.currentRepaymentCycle;
          this.repaymentCycleForm
            ?.get("currentRepayment")
            ?.setValue(repaymentCycle);
          this.fetchLoanInstallment();
        }
      });
  }

  //fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this.repaymentCycleForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel> | any) => {
        if (res?.statusCode == 200 && res?.data) {
          this.installmentDetails = res?.data;
        }
      });
  }

  //save function to save the details
  saveRepaymentCycle() {
    let payload = { ...this.repaymentCycleForm.value };
    payload.debitCurrency = this.loanDetails?.find(
      (res: any) =>
        res?.cbsAccountNumber ==
        this.repaymentCycleForm?.value?.loanAccountNumber
    )?.currencyCode;
    console.log(payload);
    let topUpArr = [
      {
        eventType: "repaymentCycle",
        operationType: "Loan",
        status: "confirm",
        masterId: "benificiaryMasterId",
        statusHeader: "Comfirm Details",
        statusNews: "Repayment Cycle",
        summary: [
          {
            header: "Loan Details",
            details: [
              { Name: this.installmentDetails?.customerName },
              {
                "Loan Account Number":
                  this.repaymentCycleForm?.get("debitAccount")?.value
              },
              { Type: this.installmentDetails?.loanType },
              {
                "Current Repayment cycle":
                  this.repaymentCycleForm?.get("currentRepayment")?.value
              },
              {
                "Requested Repayment Cycle":
                  this.repaymentCycleForm?.get("repayRequest")?.value
              }
            ]
          }
        ]
      }
    ];
    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      topUpArr,
      (payload) => this.loanService.saveService(payload)
    );
    this.router.navigate(["/user/loan/loan-service/payment-summary"]);
  }
}
