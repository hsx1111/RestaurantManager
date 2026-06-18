import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketCuisine } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class CuisineService {
  private readonly apiUrl = 'http://localhost:5080/api/cuisine';
  private readonly http = inject(HttpClient);

  getTickets(): Observable<TicketCuisine[]> {
    return this.http.get<TicketCuisine[]>(`${this.apiUrl}/tickets`, { withCredentials: true });
  }

  marquerLignePrete(idDetail: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/lignes/${idDetail}/prepare`, {}, { withCredentials: true });
  }

  marquerCommandeServie(idCommande: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/commandes/${idCommande}/servie`, {}, { withCredentials: true });
  }
}
