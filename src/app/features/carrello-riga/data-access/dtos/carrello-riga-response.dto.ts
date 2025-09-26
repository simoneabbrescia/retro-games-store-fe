import { ProdottoDTO } from '@features/prodotto';

export interface CarrelloRigaDTO {
  id: number;
  carrelloId: number;
  prodotto: ProdottoDTO;
  quantita: number;
  subTotale: number;
}
