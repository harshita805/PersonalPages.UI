import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = environment.apiBaseUrl;
  private logoutTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // 🔐 LOGIN
  login(data: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.startAutoLogout(res.token); // ✅ START TIMER
      })
    );
  }

  // 📝 REGISTER
  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // 🚪 LOGOUT
  logout() {
    localStorage.removeItem('token');
    this.clearLogoutTimer();
    this.router.navigate(['/login']);
  }

  // ✅ CHECK LOGIN
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ⏰ AUTO LOGOUT LOGIC
  private startAutoLogout(token: string) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return;

    const timeout = expiry - Date.now();
    if (timeout > 0) {
      this.logoutTimer = setTimeout(() => {
        alert('Session expired. Please login again.');
        this.logout();
      }, timeout);
    }
  }

  private clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  // 🔍 READ JWT EXP CLAIM
  private getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // convert to ms
    } catch {
      return null;
    }
  }
}
