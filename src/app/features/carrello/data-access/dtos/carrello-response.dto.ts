import { CarrelloRigaDTO } from '@features/carrello-riga';

export interface CarrelloDTO {
  id: number;
  accountId: number;
  righe: CarrelloRigaDTO[];
  totaleQuantita: number;
  totale: number;
}

export function createEmptyCarrello(): CarrelloDTO {
  return {
    id: 0,
    accountId: 0,
    righe: [],
    totaleQuantita: 0,
    totale: 0,
  };
}
