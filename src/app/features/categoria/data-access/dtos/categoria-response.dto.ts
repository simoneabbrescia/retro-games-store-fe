import { ProdottoDTO } from '@features/prodotto';

export interface CategoriaDTO {
  id: number;
  nome: string;
  prodotti: ProdottoDTO[];
  attivo: boolean;
}
