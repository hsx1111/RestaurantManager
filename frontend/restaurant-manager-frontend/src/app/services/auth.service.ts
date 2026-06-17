import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5080/api/auth';
  private readonly http = inject(HttpClient);

  readonly currentUser = signal<LoginResponse | null>(null);

  login(pin: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { pin }, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.currentUser.set(null)));
  }

  checkAuth(): Observable<LoginResponse | null> {
    return this.http.get<LoginResponse>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }
}
