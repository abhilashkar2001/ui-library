import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  baseUrl: string = environment.microServiceURL;
  constructor(private http: HttpClient) {}
  triggerTransactionEmail(formdata) {
    return this.http.post(`${this.baseUrl}/email`, formdata, {
      responseType: "text",
    });
  }
}
