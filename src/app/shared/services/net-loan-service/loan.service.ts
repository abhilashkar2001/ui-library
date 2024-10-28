import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { LoanAccounts } from "app/shared/models/loan-account.model";

import { environment } from "environments/environment";
import { Observable } from "rxjs";

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: "root",
})
export class LoanService {
  constructor(private http: HttpClient) {}

  fetchLoanDetails(customerNo): Observable<IcHttpResponseModel<LoanAccounts>> {
    return this.http.get<IcHttpResponseModel<LoanAccounts>>(
      `${MICROSERVICE_URL}/origination-matser/fetchLoanByCustNo?customerNo=${customerNo}`
    );
  }

  fetchCorpLoanDetails(corpCustId: string) {
    return this.http.get<IcHttpResponseModel<LoanAccounts>>(
      `${MICROSERVICE_URL}/origination-matser/fetchLoanByCorpCustId?corpCustId=${corpCustId}`
    );
  }

  /**get all the corpAccount details */
  fetchListofCorpAccountDetails(corpCustId: string) {
    return this.http.get<IcHttpResponseModel<LoanAccounts>>(
      `${MICROSERVICE_URL}/corporate-net-banking/getCorpAccountsForDashBoard?corpCustId=${corpCustId}`
    );
  }

  /**
   * @param accNo to fetch summary data for respective account Number
   *  */
  fetchLoanSummary(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getLoanSummaryDetails?originationAccNo=${accNo}`
    );
  }

  /**
   * @param accNo to fetch summary data for respective account Number
   *  */
  downloadLoanSummary(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadLoanSummaryDetails?originationAccNo=${accNo}`
    );
  }

  /**
   * @param accNo to fetch interest history data for respective account Number
   *  */
  fetchInterestHistory(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getLoanInterest?originationAccNo=${accNo}`
    );
  }

  /**
   * @param accNo to download interest history data pdf for respective account Number
   *  */
  downloadInterestHistory(accNo: number) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadInterestRateHistory?originationAccNo=${accNo}`,
      httpOptions
    );
  }

  //save loan service
  saveService(payload) {
    return this.http.post(
      `${MICROSERVICE_URL}/retail-fund-transfer/transfer-money`,
      payload
    );
  }

  /**
   * @param accNo to fetch current repayment cycle for respective account Number
   *  */
  fetchCurrentRepaymentCycle(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/retail-fund-transfer/fetchCurrentRepaymentCycle?accountNo=${accNo}`
    );
  }

  /**
   * @param accNo to fetch repayment schedule data for respective account Number
   *  */
  fetchRepaymentSchedule(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/repaymentSchedule?originationAccNo=${accNo}`
    );
  }

  /**
   * @param accNo to download repayment schedule data for respective account Number
   *  */
  downloadRepaymentSchedule(accNo: number) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadRepaymentSchedule?originationAccNo=${accNo}`,
      httpOptions
    );
  }

  /**
   * @param custId to fetch statistics data for respective customer id
   *  */
  fetchStatistics(custId: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/loanSummaryStatistics?custId=${custId}`
    );
  }

  /**
   * @param custId to fetch recent transaction data for respective customer id
   *  */
  fetchRecentTrans(custId: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/retail-fund-transfer/fetchRecentTransaction?customerId=${custId}`
    );
  }

  /**
   * @param accNo to fetch loan installment details for respective account number
   *  */
  fetchLoanInstallment(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/fetchLoanInstallment?originationAccNo=${accNo}`
    );
  }

  //save e statement
  saveEStatement(payload) {
    return this.http.post(`${MICROSERVICE_URL}/estatement/save`, payload);
  }

  /**
   * @param accNo to fetch pre generated details for respective account number
   *  */
  fetchPreGenerated(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getLoanStatement?originationAccNo=${accNo}`
    );
  }

  /**
   * @param accNo to fetch interest statement details for respective account number
   *  */
  fetchInterestStatement(accNo: number, payload) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getInterestStatement?originationAccNo=${accNo}${payload}`
    );
  }

  /**
   * @param accNo to download request certificate for respective account Number
   *  */
  downloadOfferLetter(accNo: number) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get(
      `${MICROSERVICE_URL}/origination-matser/fetchEmail?cbsAccountNo=${accNo}`,
      httpOptions
    );
  }

  /**
   * @param accNo to download closure letter for respective account Number
   *  */
  downloadClosureLetter(accNo: number) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadLoanClosureLetter?originationAccNo=${accNo}`,
      httpOptions
    );
  }
  /**
   * @param accNo to download final certificate for respective account Number
   *  */
  downloadFinalInterestCertificate(accNo: number) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadLoanFinalInterestCertificate?originationAccNo=${accNo}`,
      httpOptions
    );
  }

  /**
   * @param accNo to download final certificate for respective account Number
   *  */
  downloadPreGenerated(accNo: number, year: number, month: string) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadPregenaratedStatement?originationAccNo=${accNo}&years=${year}&month=${month}`,
      httpOptions
    );
  }

  //save loan service
  calculateEMI(payload) {
    return this.http.post(
      `${MICROSERVICE_URL}/loan-repayment/emi-calculation`,
      payload
    );
  }

  /**
   * @param accNo to fetch interest statement details for respective account number
   *  */
  fetchScheduledPayment(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/schedulePayment?originationAccNo=${accNo}`
    );
  }

  /**
   * @param accNo to download final certificate for respective account Number
   *  */
  downloadScheduledPayment(accNo: number) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadSchedulePayment?originationAccNo=${accNo}`,
      httpOptions
    );
  }

  /**
   * @param accNo to fetch statement details for respective account number
   *  */
  fetchViewStatement(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/viewStatement?originationAccNo=${accNo}`
    );
  }

  /**
   * @param accNo to fetch disbursement schedule details for respective account number
   *  */
  fetchDisbursementSchedule(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getDisbursmentSchedule?originationAccNo=${accNo}`
    );
  }

  /**
   * @param accNo to download final certificate for respective account Number
   *  */
  downloadViewStatement(accNo: number) {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadViewStatement?page=1&size=20&originationAccNo=${accNo}`,
      httpOptions
    );
  }
}
