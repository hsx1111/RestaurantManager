import { Plat } from './plat.model';

export interface LigneCreate {
  idPlat: number;
  quantite: number;
}

export interface CommandeCreate {
  idClient: number | null;
  idTable: number;
  lignes: LigneCreate[];
}

export interface LigneDetail {
  idPlat: number;
  nomPlat: string;
  quantite: number;
  prixUnitaire: number;
}

export interface CommandeDetail {
  id: number;
  numeroTable: number;
  nomServeur: string;
  statut: 'EnCours' | 'Servie' | 'Facturee';
  lignes: LigneDetail[];
  total: number;
}

export interface LignePanier {
  plat: Plat;
  quantite: number;
}

export interface Facture {
  idFacture: number;
  idCommande: number;
  montantTotal: number;
  modePaiement: string;
  dateFacture: string;
}
