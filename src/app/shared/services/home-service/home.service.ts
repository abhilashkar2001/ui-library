import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { COUNTRYCURRENCY } from 'app/shared/models/country-currency.mode';
import { WEBSITEPRODUCT } from 'app/shared/models/website-product.model';
import { environment } from 'environments/environment';

const baseUrl = environment.microServiceURL;
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getAccountTypes(categoray: string) {
    return this.http.get<WEBSITEPRODUCT>(
      `${baseUrl}/basis-class/fetchAllWebsiteProduct?category=${categoray}`,
    );
  }

  getCountryCurrency(branchCode: number) {
    return this.http.get<COUNTRYCURRENCY>(
      `${baseUrl}/branch/currencyByBranch?branchCode=${branchCode}`,
    );
  }
}
