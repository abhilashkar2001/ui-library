import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: 'root'
})
export class SalaryAccountService {

  constructor(private http: HttpClient) { }
  getSummary(id) {
    return this.http.get(`${MICROSERVICE_URL}/customer-api?corpId=${id}`);
  }
  saveCustomerDetails(payload) {
    return this.http.post(
      `${MICROSERVICE_URL}/customer/customer-info`,
      payload
    );
  }
  getGenericValue(screenName, genericvalues) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/generic-value?screenName=${screenName}&genericName=${genericvalues}`
    );
  }
  getCountry(){
    return this.http.get<any>(
      `${MICROSERVICE_URL}/country`
    );
  }
  getPinCodes(id){
    return this.http.get<any>(
      `${MICROSERVICE_URL}/city/fetchByPinCode?pincode=${id}`
    );
  }
}
