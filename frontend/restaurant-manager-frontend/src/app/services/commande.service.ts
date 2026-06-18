import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandeCreate, CommandeDetail } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private readonly apiUrl = 'http://localhost:5080/api/commandes';
  private readonly http = inject(HttpClient);

  create(commande: CommandeCreate): Observable<CommandeDetail> {
    return this.http.post<CommandeDetail>(this.apiUrl, commande, { withCredentials: true });
  }
}
