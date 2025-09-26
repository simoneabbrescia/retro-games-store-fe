import { ProdottoDTO } from '@features/prodotto';

export interface OrdineRigaDTO {
  id: number;
  ordineId: number;
  prodotto: ProdottoDTO;
  quantita: number;
  prezzoUnitario: number;
  subTotale: number;
}
