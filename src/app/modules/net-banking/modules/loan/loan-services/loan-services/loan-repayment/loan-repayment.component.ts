import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoanRepaymentStore } from "./loan-repayment.store";
import { LoanDetailsModel } from "app/shared/models/loan-details.model";
import { GenericValueService } from "app/shared/services/generic-value.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { LoanService } from "app/shared/services/net-loan-service/loan.service";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { LoanInstallmentModel } from "app/shared/models/loan-installment.model";
import { findCurrency, removeSpecCharsOnly } from "app/shared/helpers/utils";
import { Router } from "@angular/router";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { TokenStorageService } from "app/shared/token-storage.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-loan-repayment",
  templateUrl: "./loan-repayment.component.html",
  styleUrls: ["./loan-repayment.component.scss"]
})
export class LoanRepaymentComponent implements OnInit {
  repaymentForm: FormGroup | undefined;
  accountDetails: any = LoanRepaymentStore.loanAccountDetails;
  genericValue: any = { PAYMENTTYPE: [] };
  loanDetails: LoanDetailsModel[] | any;
  installmentDetails: LoanInstallmentModel | any;
  currentCurrency: any;
  profileInfo: any;
  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private sesssionStorageService: SessionStorageService,
    private loanService: LoanService,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.loanDetails = this.sesssionStorageService.getLoanInfo();
    this.profileInfo = this.tokenService.getUser();
    this.currentCurrency = findCurrency(this.profileInfo?.branchCrncyCode);
    this.buildLoanRepayment();
    this.fetchGenericValues();
  }

  buildLoanRepayment() {
    this.repaymentForm = this.fb.group({
      debitAccount: [""],
      paymentType: [""],
      creditAccount: [""],
      creditAmount: [""],
      creditCurrency: [""],
      totalChargeAmount: [""],
      totalTransactionAmount: [""],
      debitCurrency: [""],
      transferType: "Loan Repayment",
      source: "I",
      exchangeRate: [""],
      equivalentAmount: [""]
    });
    this.repaymentForm
      .get("creditAccount")
      ?.patchValue(this.loanDetails[0]?.cbsAccountNumber);
    this.fetchInstallment();
    this.repaymentForm
      .get("creditAmount")
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((res) => {
        this.repaymentForm?.get("totalTransactionAmount")?.patchValue(res);
        const exchangeRate = this.repaymentForm?.get("exchangeRate")?.value
          ? Number(this.repaymentForm?.get("exchangeRate")?.value)
          : 1;
        const equi = Number(res) * exchangeRate;
        this.repaymentForm?.get("equivalentAmount")?.patchValue(equi);
      });
  }

  /**
   * Fetch the generic data
   */
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

  /**
   * fetch installment details for the selected account number
   */

  fetchInstallment() {
    this.loanService
      .fetchLoanInstallment(this.repaymentForm?.value?.creditAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel> | any) => {
        if (res?.statusCode == 200) {
          this.installmentDetails = res?.data;
          this.getChargeDetails(this.installmentDetails?.originationId);
        }
      });
  }

  /**
   * To get the Charge details
   * @param data
   */
  getChargeDetails(data: any) {
    this.loanService.getLoanChargeInfoDetails(data).subscribe((res) => {
      if (res?.statusCode == 200) {
        let chargeData = res?.data;
        const totalCharge = chargeData?.find(
          (res: any) => res?.tag == "total"
        )?.amount;
        this.repaymentForm?.get("totalChargeAmount")?.patchValue(totalCharge);
      }
    });
  }

  getDecimalValue(value: string) {
    return removeSpecCharsOnly(
      this.currentCurrency?.thousandsSeparator,
      value || 0
    );
  }

  /**
   * save repayment method
   */

  saveRepayment() {
    let payload = {
      ...this.repaymentForm?.value,
      creditAmount: this.getDecimalValue(
        this.repaymentForm?.value?.creditAmount
      )
    };
    payload.debitCurrency = this.loanDetails?.find(
      (res: any) =>
        res?.cbsAccountNumber == this.repaymentForm?.value?.debitAccount
    )?.currencyCode;
    let loanRepaymentArr = [
      {
        eventType: "loanRepayment",
        operationType: "Loan",
        status: "details",
        masterId: "benificiaryMasterId",
        statusHeader: "Comfirm Details",
        statusNews: "Loan Repayment",
        summary: [
          {
            header: "Loan Details",
            details: [
              {
                "Loan Account Number":
                  this.repaymentForm?.get("creditAccount")?.value
              },
              { "Current Due": "" },
              { "Due Date": "" },
              {
                Arrear: this.installmentDetails?.arrear
              },
              {
                "Principal Outstanding":
                  this.installmentDetails?.outstandPrincpl
              },
              {
                "EMI Amount": this.installmentDetails?.emiAmount
              },
              { "Interest rate": this.installmentDetails?.interestRate },
              { "Loan Breakup Dues": "" },
              { "Payment Type": this.repaymentForm?.value?.paymentType }
            ]
          },
          {
            header: "Send From",
            details: [
              { "Payment Type": this.repaymentForm?.value.paymentType },
              { Amount: this.repaymentForm?.value.debitAccount },
              {
                Amount:
                  this.getDecimalValue(this.repaymentForm?.value.tenureYear) +
                  "Year"
              },
              { Payee: "" },
              { "Account No": this.repaymentForm?.value.debitAccount },
              { "Total Charge Amount": "" },
              { "Total Transaction Amount": "" },
              { Remark: "" }
            ]
          }
        ]
      }
    ];
    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      loanRepaymentArr,
      (payload) => this.loanService.saveService(payload)
    );

    this.router.navigate(["/user/loan/loan-service/payment-summary"]);
  }
}
