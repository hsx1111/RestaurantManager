import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Categorie } from '../models/categorie.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private readonly apiUrl = 'http://localhost:5080/api/categories';
  private readonly http = inject(HttpClient);

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl, { withCredentials: true });
  }

  create(nomCategorie: string): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, { nomCategorie }, { withCredentials: true });
  }

  update(idCategorie: number, nomCategorie: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${idCategorie}`, { nomCategorie }, { withCredentials: true });
  }

  delete(idCategorie: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idCategorie}`, { withCredentials: true });
  }
}
