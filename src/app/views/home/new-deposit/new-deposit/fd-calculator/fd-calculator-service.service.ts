import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class FdCalculatorServiceService {
  protected base_url = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  submitFixedDetails(fixedDetails) {
    return this.http.post<any>(
      `${this.base_url}/fixed-deposit-details`,
      fixedDetails
    );
  }

  submitFdPersonal(personal) {
    return this.http.post<any>(
      `${this.base_url}/fixed-deposit-details/save-fd-customer-info`,
      personal
    );
  }
  getCustomerDetails() {
    return this.http.get<any>(
      `${this.base_url}/fixed-deposit-details/account-details?customerId=10056`
    );
  }
  getFixedDeposit(fixedDepositId) {
    return this.http.get<any>(
      `${this.base_url}/fixed-deposit-details?fixedDepositId=${fixedDepositId}`
    );
  }
}
