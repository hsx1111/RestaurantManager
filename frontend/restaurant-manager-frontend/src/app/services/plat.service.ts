import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Plat, PlatCreate, PlatUpdate } from '../models/plat.model';

@Injectable({
  providedIn: 'root'
})
export class PlatService {
  private readonly apiUrl = 'http://localhost:5080/api/plats';
  private readonly http = inject(HttpClient);

  getAll(): Observable<Plat[]> {
    return this.http.get<Plat[]>(this.apiUrl, { withCredentials: true });
  }

  create(plat: PlatCreate): Observable<Plat> {
    return this.http.post<Plat>(this.apiUrl, plat, { withCredentials: true });
  }

  update(id: number, plat: PlatUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, plat, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
