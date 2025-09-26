import { CarrelloRigaDTO } from '@features/carrello-riga';

export interface CarrelloDTO {
  id: number;
  accountId: number;
  righe: CarrelloRigaDTO[];
  totaleQuantita: number;
  totale: number;
}
