import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanAccounts } from 'app/shared/models/loan-account.model';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  constructor(private http: HttpClient) {}

  fetchLoanDetails(
    customerNo: any,
  ): Observable<IcHttpResponseModel<LoanAccounts>> {
    return this.http.get<IcHttpResponseModel<LoanAccounts>>(
      `${MICROSERVICE_URL}/origination-matser/fetchLoanByCustNo?customerNo=${customerNo}`,
    );
  }

  fetchCorpLoanDetails(corpCustId: string) {
    return this.http.get<IcHttpResponseModel<LoanAccounts>>(
      `${MICROSERVICE_URL}/origination-matser/fetchLoanByCorpCustId?corpCustId=${corpCustId}`,
    );
  }

  /**get all the corpAccount details */
  fetchListofCorpAccountDetails(corpCustId: string) {
    return this.http.get<IcHttpResponseModel<LoanAccounts>>(
      `${MICROSERVICE_URL}/corporate-net-banking/getCorpAccountsForDashBoard?corpCustId=${corpCustId}`,
    );
  }

  /**
   * @param accNo to fetch summary data for respective account Number
   *  */
  fetchLoanSummary(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getLoanSummaryDetails?originationAccNo=${accNo}`,
    );
  }

  /**
   * @param accNo to fetch summary data for respective account Number
   *  */
  downloadLoanSummary(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadLoanSummaryDetails?originationAccNo=${accNo}`,
    );
  }

  //save loan service
  saveService(payload: any) {
    return this.http.post(
      `${MICROSERVICE_URL}/corporate-net-banking/corpTrans`,
      payload,
    );
  }

  /**
   * @param accNo to fetch current repayment cycle for respective account Number
   *  */
  fetchCurrentRepaymentCycle(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/retail-fund-transfer/fetchCurrentRepaymentCycle?accountNo=${accNo}`,
    );
  }

  /**
   * @param accNo to fetch repayment schedule data for respective account Number
   *  */
  fetchRepaymentSchedule(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/repaymentSchedule?originationAccNo=${accNo}`,
    );
  }

  /**
   * @param accNo to fetch loan installment details for respective account number
   *  */
  fetchLoanInstallment(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/fetchLoanInstallment?originationAccNo=${accNo}`,
    );
  }

  //save e statement
  saveEStatement(payload: any) {
    return this.http.post(`${MICROSERVICE_URL}/estatement/save`, payload);
  }

  /**
   * @param accNo to fetch pre generated details for respective account number
   *  */
  fetchPreGenerated(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getLoanStatement?originationAccNo=${accNo}`,
    );
  }

  /**
   * @param accNo to fetch interest statement details for respective account number
   *  */
  fetchInterestStatement(accNo: number, payload: any) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getInterestStatement?originationAccNo=${accNo}${payload}`,
    );
  }

  /**
   * @param accNo to download request certificate for respective account Number
   *  */
  downloadOfferLetter(accNo: number) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(
      `${MICROSERVICE_URL}/origination-matser/fetchEmail?cbsAccountNo=${accNo}`,
      httpOptions,
    );
  }

  /**
   * @param accNo to download closure letter for respective account Number
   *  */
  downloadClosureLetter(accNo: number) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadLoanClosureLetter?originationAccNo=${accNo}`,
      httpOptions,
    );
  }

  /**
   * @param accNo to download final certificate for respective account Number
   *  */
  downloadFinalInterestCertificate(accNo: number) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadLoanFinalInterestCertificate?originationAccNo=${accNo}`,
      httpOptions,
    );
  }

  //save loan service
  calculateEMI(payload: any) {
    return this.http.post(
      `${MICROSERVICE_URL}/loan-repayment/emi-calculation`,
      payload,
    );
  }

  /**
   * @param accNo to fetch statement details for respective account number
   *  */
  fetchViewStatement(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/viewStatement?originationAccNo=${accNo}`,
    );
  }

  /**
   * @param accNo to fetch disbursement schedule details for respective account number
   *  */
  fetchDisbursementSchedule(accNo: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/getDisbursmentSchedule?originationAccNo=${accNo}`,
    );
  }

  /**
   * @param accNo to download final certificate for respective account Number
   *  */
  downloadViewStatement(accNo: number) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(
      `${MICROSERVICE_URL}/transaction/downloadViewStatement?page=1&size=20&originationAccNo=${accNo}`,
      httpOptions,
    );
  }

  /**
   * To get the loan  charge details
   * @param payload
   * @returns
   */
  getLoanChargeInfoDetails(payload: any) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/loanInterestAndCharge/disburseRepaymentCharge?originationId=${payload}`,
    );
  }

  saveTermsandCreditFields(payload: any) {
    return this.http.put<any>(
      `${MICROSERVICE_URL}/loan-detail/updateCreditAndTermsField`,
      payload,
    );
  }
}
