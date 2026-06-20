import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandeCreate, CommandeDetail, Facture, LigneCreate } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private readonly apiUrl = 'http://localhost:5080/api/commandes';
  private readonly http = inject(HttpClient);

  create(commande: CommandeCreate): Observable<CommandeDetail> {
    return this.http.post<CommandeDetail>(this.apiUrl, commande, { withCredentials: true });
  }

  getParTable(idTable: number): Observable<CommandeDetail> {
    return this.http.get<CommandeDetail>(`${this.apiUrl}/table/${idTable}`, { withCredentials: true });
  }

  ajouterLignes(idCommande: number, lignes: LigneCreate[]): Observable<CommandeDetail> {
    return this.http.post<CommandeDetail>(`${this.apiUrl}/${idCommande}/lignes`, lignes, { withCredentials: true });
  }

  cloturer(idCommande: number, modePaiement: string): Observable<Facture> {
    return this.http.post<Facture>(
      `${this.apiUrl}/${idCommande}/cloturer`,
      { modePaiement },
      { withCredentials: true }
    );
  }
}
