import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  #alertService = inject(AlertService);
  private baseUrl = environment.apiBaseUrl;
  private logoutTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // 📝 REGISTER
  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, data).pipe(
      tap(res => {
        // ✅ SAVE TOKEN BASED ON USER CHOICE
        if (data.staySignedIn) {
          localStorage.setItem('token', res.token);
        } else {
          sessionStorage.setItem('token', res.token);
        }

        this.startAutoLogout(res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.clearLogoutTimer();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token')
      || sessionStorage.getItem('token');
  }

  // 🔐 AUTO LOGOUT
  private startAutoLogout(token: string) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return;

    const timeout = expiry - Date.now();
    if (timeout > 0) {
      this.logoutTimer = setTimeout(() => {
        this.#alertService.show('Session expired. Please login again.');
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

  private getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }
}
