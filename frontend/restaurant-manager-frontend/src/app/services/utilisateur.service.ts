import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur, UtilisateurCreate, UtilisateurUpdate } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private readonly apiUrl = 'http://localhost:5080/api/utilisateurs';
  private readonly http = inject(HttpClient);

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl, { withCredentials: true });
  }

  create(utilisateur: UtilisateurCreate): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur, { withCredentials: true });
  }

  update(id: number, utilisateur: UtilisateurUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, utilisateur, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
