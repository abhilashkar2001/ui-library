import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';

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

  public faceRegister(data: FormData) {
    return this.http.post<any>(`${baseUrl}/auth/faceid/register`, data);
  }

  faceLogin(captured: any, userName: any) {
    return this.http.post<any>(
      `${baseUrl}/auth/faceid/loginById?userName=${userName}`,
      captured,
    );
  }

  CallingSGIFPCapture(): Observable<any> {
    return this.http.get(`https://localhost:8443/SGIFPCapture`).pipe(
      tap((result) => {
        return result;
      }),
    );
  }
}
