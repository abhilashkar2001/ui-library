import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ChequeService {
  protected basePath = environment.microServiceURL;
  constructor(private httpClient: HttpClient) {}
  //   mobileNo = JSON.parse(sessionStorage.getItem("customer-Info")).mobileNumber;
  // fetchCustInfoByMobile(mobileNo) {
  //   return this.httpClient.get<any>(
  //     `${this.basePath}/fundTransfer/fetchCustInfo?mobileNo=${mobileNo}`
  //   );
  // }
  //   fetchAccountlistByMobile() {
  //     return this.httpClient.get(
  //       `${this.basePath}/fundTransfer/fetchCustInfo?mobileNo=${this.mobileNo}`
  //     );
  //   }
  fetchAccountDetailByAccNo(accNo: any) {
    return this.httpClient.get(
      `${this.basePath}/fundTransfer/fetchCustInfo?accountNumber=${accNo}`
    );
  }
  fetchGeneric() {
    return this.httpClient.get(
      `${this.basePath}/generic-value?screenName=Instrument%20Maintenance&genericName=INSTRUMENTTYPE,NOOFLEAVES&language=English`
    );
  }

  fetchBalance(originationAccNo: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/flex-service/queryBalance?originationAccNo=${originationAccNo}`
    );
  }

  fetchBenificiary(payload: any) {
    return this.httpClient.post<any>(
      `${this.basePath}/retail-beneficiary/fetchBenificiary`,
      payload
    );
  }

  fetchInfoByoriginationAccNo(accNo: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/account/info?originationAccNo=${accNo}`
    );
  }
  getCountries() {
    return this.httpClient.get<any>(
      `${this.basePath}/country?oneTimeAuth=Y&recordStatus=OPEN`
    );
  }
  getStateByCountry(id: any) {
    return this.httpClient.get(`${this.basePath}/state?countryId=${id}`);
  }
  getCityByState(stateId: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/city?stateId=${stateId}&authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }
  fetchBranches(bankCode: any) {
    return this.httpClient.get(
      `${this.basePath}/branch?bankCode=${bankCode}&oneTimeAuth=Y&recordStatus=OPEN`
    );
  }

  fetchAddress(originationId: any) {
    return this.httpClient.get(
      `${this.basePath}/nominee-details/fetchGuardianAddress?originationId=${originationId}&isSame=true`
    );
  }

  getChequeNoByAccNo(accNo: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/flex-service/chequeBookNo-by-accountNo?accountNo=${accNo}`
    );
  }
  savedemandDraft(payload: any) {
    return this.httpClient.post(
      `${this.basePath}/retail-fund-transfer/demandDraft`,
      payload
    );
  }
  saveChequeDetails(payload: any) {
    if (payload.isEdit) payload.isEdit = true;
    else payload.isEdit = false;

    const { chequeBookNo, accountNo, noOfChequeLeaves, isEdit } = payload;

    return this.httpClient.get<any>(
      `${this.basePath}/flex-service/save-cheque-book-details?chequeBookNo=${chequeBookNo}&accountNo=${accountNo}&noOfChequeLeaves=${noOfChequeLeaves}&isEdit=${isEdit}`
    );
  }

  saveRequestChequeToInstrument(payload: any) {
    return this.httpClient.post(`${this.basePath}/instrumentMaint`, payload);
  }

  inquiryCheque(payload: any) {
    const {
      inquiryChequeBy,
      page,
      size,
      fromChequeBookNo,
      toChequeBookNo,
      accountNo,
      chequeBookNumber,
      status
    } = payload;

    if (inquiryChequeBy === "Number") {
      return this.httpClient.get<any>(
        `${this.basePath}/instrumentMaint/internet-cheque-book?inquiryChequeBy=${inquiryChequeBy}&page=${page}&size=${size}&chequeBookNumber=${chequeBookNumber}&accountNo=${accountNo}`
      );
    }
    if (inquiryChequeBy === "Range") {
      return this.httpClient.get<any>(
        `${this.basePath}/instrumentMaint/internet-cheque-book?inquiryChequeBy=${inquiryChequeBy}&page=${page}&size=${size}&fromChequeBookNo=${fromChequeBookNo}&toChequeBookNo=${toChequeBookNo}&accountNo=${accountNo}`
      );
    }
    if (inquiryChequeBy === "Status") {
      return this.httpClient.get<any>(
        `${this.basePath}/instrumentMaint/internet-cheque-book?inquiryChequeBy=${inquiryChequeBy}&page=${page}&size=${size}&accountNo=${accountNo}&status=${status}`
      );
    }
    return;
  }

  stopCheque(payload: any) {
    return this.httpClient.post<any>(
      `${this.basePath}/instrumentStatus/stop-cheque`,
      payload
    );
  }

  auditLogRevisions(payload: any) {
    const { id } = payload;
    return this.httpClient.post<any>(
      `${this.basePath}/auditLog/revisions?id=${id}&classname=IcInstrumentMaint&authStatus=AUTHORIZED&module=maintenance`,
      {}
    );
  }

  fetchAccountDetails(accountNo: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/retail-fund-transfer/fetchAccountDetails?accountNo=${accountNo}`
    );
  }

  fetchAccountStatement(accountNo: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/transaction/accountSummary?accountNumber=${accountNo}`
    );
  }

  downloadStatement(
    accountNo: string,
    operationType: string
  ): Observable<Blob> {
    const headers = new HttpHeaders({
      "Content-Type": "application/pdf",
      Accept: "application/pdf"
    });

    return this.httpClient.get(
      `${this.basePath}/fundTransfer/AccountDownload?operationType=${operationType}&accountNumber=${accountNo}`,
      {
        responseType: "blob",
        headers: headers
      }
    );
  }

  downloadAccountSummary(accountNo: string) {
    return this.httpClient.get(
      `${this.basePath}/retail-fund-transfer/downloadAccountDetails?accountNo=${accountNo}`,
      { responseType: "blob" }
    );
  }

  fetchAccountSummary(accountNo: string) {
    return this.httpClient.get(
      `${this.basePath}/transaction/accountSummary?accountNumber=${accountNo}`
    );
  }

  downloadAccountInformation(mobileNo: any): Observable<Blob> {
    const headers = new HttpHeaders({
      "Content-Type": "application/pdf",
      Accept: "application/pdf"
    });
    return this.httpClient.get(
      `${this.basePath}/retail-fund-transfer/downloadAccountInfo?mobNumber=${mobileNo}`,
      {
        responseType: "blob",
        headers: headers
      }
    );
  }

  eStatementSubscribe(payload: any) {
    return this.httpClient.post<any>(
      `${this.basePath}/estatement/save`,
      payload
    );
  }
  downloadPregeneratedStatement(payload: any) {
    const httpOptions = {
      responseType: "blob" as "json"
    };
    return this.httpClient.get<any>(
      `${this.basePath}/fundTransfer/AccountDownload?accountNumber=${payload.accountNumber}&operationType=Generated_Statement&statement=${payload.statementOption}&year=${payload.year}`,
      httpOptions
    );
  }
  fetchChargeSummary(accountNo: string, year: string) {
    return this.httpClient.get(
      `${this.basePath}/transaction/accountSummary?accountNumber=${accountNo}&year=${year}`
    );
  }
  generateAccountQr(accnum: any) {
    return this.httpClient.post<any>(
      `${this.basePath}/task-summary/get-qr-code?originationAccNo=${accnum}`,
      "",
      { responseType: "Blob" as "json" }
    );
  }

  saveFeedback(payload: any) {
    return this.httpClient.post(
      `${this.basePath}/transaction/customerFeedbackInfo`,
      payload
    );
  }
}
