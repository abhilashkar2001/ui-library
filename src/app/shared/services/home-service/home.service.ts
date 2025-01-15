import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
