import { ProdottoDTO } from '@features/prodotto';

export interface PiattaformaDTO {
  id: number;
  codice: string;
  nome: string;
  annoUscitaPiattaforma: number;
  prodotti: ProdottoDTO[];
  attivo: boolean;
}
