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
  lignes: LigneDetail[];
  total: number;
}
