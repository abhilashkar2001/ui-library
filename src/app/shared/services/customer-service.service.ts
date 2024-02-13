import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  constructor(private http:HttpClient) { }
  public fetchCustomerData(customerID) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/customer-api?customerId=${customerID}`
    );
  }
}
