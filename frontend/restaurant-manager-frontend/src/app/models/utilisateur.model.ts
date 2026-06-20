import { Role } from './auth.model';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  role: Role;
}

export interface UtilisateurCreate {
  nom: string;
  prenom: string;
  pin: string;
  role: Role;
}

export interface UtilisateurUpdate {
  nom: string;
  prenom: string;
  role: Role;
  pin?: string;
}
