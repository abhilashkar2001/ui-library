import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const baseUrl = environment.microServiceURL;
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getAllCountries() {
    return this.http.get<any>(
      `${baseUrl}/country?oneTimeAuth=Y&recordStatus=OPEN`,
    );
  }
}
