export interface LigneTicket {
  idDetail: number;
  nomPlat: string;
  quantite: number;
  prepare: boolean;
}

export interface TicketCuisine {
  idCommande: number;
  numeroTable: number;
  nomServeur: string;
  dateEnvoi: string;
  lignes: LigneTicket[];
}
