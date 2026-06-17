export interface Plat {
  id: number;
  nom: string;
  description?: string | null;
  prix: number;
  idCategorie: number;
  nomCategorie: string;
}

export interface PlatCreate {
  nom: string;
  description: string | null;
  prix: number;
  idCategorie: number;
}

export type PlatUpdate = PlatCreate;
