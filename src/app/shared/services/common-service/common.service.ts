import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // private urlSource = new BehaviorSubject('initial value');
  private userMobileSource = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  isUserUsingDifferentMobile(value: boolean) {
    this.userMobileSource.next(value);
  }

  deleteDocument(documentId: any) {
    return this.http.delete(`${baseUrl}/upload-document/${documentId}`);
  }

  uploadDocument(formData: any) {
    return this.http.post<any>(`${baseUrl}/upload-document`, formData);
  }

  getAllCountries() {
    return this.http.get<any>(
      `${baseUrl}/country?oneTimeAuth=Y&recordStatus=OPEN`,
    );
  }

  generateOTP(mobile: any) {
    return this.http.get<any>(`${baseUrl}/auth/generateOTP?mobile=${mobile}`);
  }
}
