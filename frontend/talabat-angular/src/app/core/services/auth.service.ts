import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { CurrentUser } from '@core/models/models';

const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Reactive flag other parts of the app (header, guards) can read. */
  readonly hasToken = signal<boolean>(this.readToken() !== null);
  readonly currentUser = signal<CurrentUser | null>(null);
  readonly isAuthenticated = computed(() => this.hasToken());

  getToken(): string | null {
    return this.readToken();
  }

  private readToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string | null) {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    this.hasToken.set(!!token);
  }

  login(email: string, password: string) {
    return this.http
      .post<CurrentUser>(`${environment.apiBase}/api/Accounts/Login`, { email, password })
      .pipe();
  }

  register(payload: { displayName: string; email: string; phoneNumber: string; password: string }) {
    return this.http.post<CurrentUser>(`${environment.apiBase}/api/Accounts/Register`, payload);
  }

  emailExists(email: string) {
    return this.http.get<boolean>(`${environment.apiBase}/api/Accounts/EmailExists`, {
      params: { email },
    });
  }

  fetchCurrentUser() {
    return this.http.get<CurrentUser>(`${environment.apiBase}/api/Accounts/CurrentUser`);
  }

  /** Call after a successful login/register response to persist the session. */
  applySession(user: CurrentUser) {
    this.setToken(user.token);
    this.currentUser.set(user);
  }

  logout() {
    this.setToken(null);
    this.currentUser.set(null);
  }
}
