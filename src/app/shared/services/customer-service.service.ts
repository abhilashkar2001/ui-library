import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: 'root',
})
export class CustomerServiceService {
  constructor(private http: HttpClient) {}
  getHolidayDates(branchCode: string, year: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/holiday/fetchBranchDataAndYear?branchCode=${branchCode}&year=${year}`,
    );
  }
}
