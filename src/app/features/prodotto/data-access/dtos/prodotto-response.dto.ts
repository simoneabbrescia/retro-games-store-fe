import { PiattaformaDTO } from '@features/piattaforma';

export interface ProdottoDTO {
  id: number;
  sku: string;
  nome: string;
  categoria: string;
  piattaforme: PiattaformaDTO[];
  descrizione: string;
  annoUscita: number;
  prezzo: number;
  imgUrl: string;
  attivo: boolean;
}
