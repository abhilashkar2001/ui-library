import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

const baseUrl = environment.basePath;

@Injectable({
  providedIn: "root",
})
export class LoanService {
  constructor(private http: HttpClient) {}

  getLoanTypes(
    loanServices: string = "Loan Opening Services"
  ): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/basis-class?businessSuite=${loanServices}`
    );
  }

  getSubLoanTypes(subAccount: string): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/details/fetchSubClass?basisClass=${subAccount}`
    );
  }

  getExistingUserDetails(mobileNumber: string): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/fetchExistingCustomer?mobile=${mobileNumber}`
    );
  }

  saveLoanPersonaldetails(loanDetails: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/loan-account/save`, loanDetails);
  }

  getLoanSummary(loanId: any): Observable<any> | any {
    return this.http.get(`${baseUrl}/webSummary?loanId=${loanId}`);
  }
}
