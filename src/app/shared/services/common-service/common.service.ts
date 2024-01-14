import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

const baseUrl = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class CommonService {
  private urlSource = new BehaviorSubject("initial value");
  public changedUrl = this.urlSource.asObservable();
  private userMobileSource = new BehaviorSubject(false);
  public userMobileNumber = this.userMobileSource.asObservable();
  private calCulatorsDataSource = new BehaviorSubject(false);
  public $calculatorsData = this.calCulatorsDataSource.asObservable();

  constructor(private http: HttpClient) {}

  isExisitingUser(phoneNumber: number): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/fetchExistingCustomer?mobile=${phoneNumber}`
    );
  }

  updateData(value: any) {
    this.urlSource.next(value);
  }

  isUserUsingDifferentMobile(value: boolean) {
    this.userMobileSource.next(value);
  }

  loanCalculatorsDataSave(calcData: any) {
    this.calCulatorsDataSource.next(calcData);
  }

  deleteDocument(documentId) {
    return this.http.delete(`${baseUrl}/upload-document/${documentId}`);
  }

  getAllCountries() {
    return this.http.get<any>(
      `${baseUrl}/country?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }
}
