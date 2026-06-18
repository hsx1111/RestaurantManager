import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private readonly apiUrl = 'http://localhost:5080/api/tables';
  private readonly http = inject(HttpClient);

  getAll(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl, { withCredentials: true });
  }
}
