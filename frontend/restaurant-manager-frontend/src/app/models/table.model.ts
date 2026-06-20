export interface Table {
  id: number;
  nombrePlace: number;
  estLibre: boolean;
}

export interface TableCreate {
  nombrePlace: number;
}

export interface TableUpdate {
  nombrePlace: number;
}
