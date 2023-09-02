import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NewDepositService {
  protected base_url = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  private token = new BehaviorSubject<any>(false);
  getToken() {
    return this.token.asObservable();
  }
  setToken(token: any) {
    this.token.next(token);
  }
  private isCreateFdDone$ = new BehaviorSubject<any>(false);
  getCreateFdDone() {
    return this.isCreateFdDone$.asObservable();
  }
  serCreateFdDone(value) {
    this.isCreateFdDone$.next(value);
  }

  // https://192.168.0.127:8765/auth/generateOTP?mobile=9114386257
  getOtp(mobile) {
    return this.http.get<any>(
      `${this.base_url}/auth/generateOTP?mobile=${mobile}`
    );
  }
  verifyOtp(payload) {
    //https://192.168.0.127:8765/auth/verifyOTP
    return this.http.post<any>(`${this.base_url}/auth/verifyOTP`, payload);
  }
}
