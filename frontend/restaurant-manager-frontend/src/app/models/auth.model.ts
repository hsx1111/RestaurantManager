export interface LoginRequest {
  pin: string;
}

export type Role = 'Serveur' | 'Gestionnaire' | 'Cuisine';

export interface LoginResponse {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  role: Role;
}
