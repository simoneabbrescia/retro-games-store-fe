import { CarrelloRigaReq } from '@features/carrello-riga';

export interface CarrelloReq {
  id?: number;
  accountId?: number;
  righe?: CarrelloRigaReq[];
}
