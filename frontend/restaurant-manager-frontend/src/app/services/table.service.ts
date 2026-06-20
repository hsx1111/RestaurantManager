import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Table, TableCreate, TableUpdate } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private readonly apiUrl = 'http://localhost:5080/api/tables';
  private readonly http = inject(HttpClient);

  getAll(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl, { withCredentials: true });
  }

  create(table: TableCreate): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table, { withCredentials: true });
  }

  update(id: number, table: TableUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, table, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
