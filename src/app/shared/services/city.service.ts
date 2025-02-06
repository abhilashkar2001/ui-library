import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient) {}

  fetchZipcodeDetails(pincode: any) {
    return this.http.get(
      `${MICROSERVICE_URL}/city/fetchByPinCode?pincode=${pincode}`,
    );
  }
}
