import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly apiUrl = 'http://localhost:5080/api/health';

  constructor(private http: HttpClient) {}

  getHealth(): Observable<string> {
    return this.http.get(this.apiUrl, { withCredentials: true, responseType: 'text' });
  }
}
