import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class PersonalDetailsService {
  protected baseUrl = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  fetchStateCityByZipcode(pincode) {
    return this.http.get(
      `${this.baseUrl}/city/fetchByPinCode?pincode=${pincode}`
    );
  }

  getCustomerByCif(id) {
    return this.http.get<any>(`${this.baseUrl}/customer-api?customerNo=${id}`);
  }
}
