import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class CreateRdService {
  protected baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  updateRdDetails(rdDetails) {
    return this.http.post<any>(`${this.baseUrl}/reccuringDeposite`, rdDetails);
  }
  getRdfromId(id) {
    return this.http.get(
      `${this.baseUrl}/reccuringDeposite?recurringDepositId=${id}`
    );
  }
}
