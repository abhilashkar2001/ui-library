import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private http: HttpClient) {}

  /**
   * Post-sign in call this api to fetch the logged-in user profile info
   * @returns {Observable<User>} profile info observable of the logged-in user
   */
  loadUserProfile() {
    return this.http.get<User>(
      `${environment.microServiceURL}/loginApi/profile`,
    );
  }
}
