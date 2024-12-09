import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: "root"
})
export class CreditcardService {
  constructor(private httpClient: HttpClient) {}
  saveCreditLimitDetails(cardNo: any, amt: any) {
    return this.httpClient.put<any>(
      `${baseUrl}/card/update-eligibal-limit?cardNumber=${cardNo}&creditLimit=${amt}`,
      {}
    );
  }

  getEligibleAmount(cardNo: number) {
    return this.httpClient.get(
      `${baseUrl}/card/eligibal-limit?cardNumber=${cardNo}`
    );
  }
  generateOTP(mobile: any) {
    return this.httpClient.get<any>(
      `${baseUrl}/auth/generateOTP?mobile=${mobile}`
    );
  }
  verifyOtp(otpObject: any) {
    return this.httpClient.post(`${baseUrl}/auth/verifyOTP`, otpObject);
  }
  getDesiredCreditCardList(cardNo: number) {
    return this.httpClient.get(
      `${baseUrl}/card/desired-limit?cardNumber=${cardNo}`
    );
  }

  saveDesiredLimit(cardNo: number, amt: number) {
    return this.httpClient.put<any>(
      `${baseUrl}/card/update-eligibal-limit?cardNumber=${cardNo}&creditLimit=${amt}`,
      {}
    );
  }

  saveDometic(payload: any) {
    return this.httpClient.put<any>(`${baseUrl}/card/updateLimit`, payload);
  }

  getCreditCardList(customerID: number) {
    return this.httpClient.get(
      `${baseUrl}/card/fetch-cardNo?customerId=${customerID}`
    );
  }

  fetchAccountDetails(cardNo: number, name: string) {
    return this.httpClient.get(
      `${baseUrl}/card/fetch-usage-limits?cardNumber=${cardNo}&usageType=${name}`
    );
  }
}
