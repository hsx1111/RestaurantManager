import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation, ReservationCreate, ReservationUpdate } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly apiUrl = 'http://localhost:5080/api/reservations';
  private readonly http = inject(HttpClient);

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, { withCredentials: true });
  }

  create(reservation: ReservationCreate): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation, { withCredentials: true });
  }

  update(id: number, reservation: ReservationUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, reservation, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
