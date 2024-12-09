import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(private http: HttpClient) {}

  corporateLogin(payload: any) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/loginApi/coprLogin`,
      payload
    );
  }
}
