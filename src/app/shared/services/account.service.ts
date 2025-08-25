import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccountDetails(originationId: number) {
    return this.http.get<any>(
      `${baseUrl}/account?originationId=${originationId}`,
    );
  }

  //   Save Account personal details
  saveAccountPersonalDetails(payload: any) {
    return this.http.post<any>(`${baseUrl}/account`, payload);
  }
}
