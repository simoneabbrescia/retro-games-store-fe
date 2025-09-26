export interface ProdottoReq {
  id?: number;
  sku?: string;
  nome?: string;
  categoriaId?: number;
  piattaformaId?: number[];
  descrizione?: string;
  annoUscita?: number;
  prezzo?: number;
  imgUrl?: string;
  attivo?: boolean;
}
