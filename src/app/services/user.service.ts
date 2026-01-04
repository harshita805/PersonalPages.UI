import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<any>(`${this.baseUrl}/user/profile`);
  }

  updateProfile(data: any) {
    return this.http.put(`${this.baseUrl}/user/profile`, data);
  }
}
