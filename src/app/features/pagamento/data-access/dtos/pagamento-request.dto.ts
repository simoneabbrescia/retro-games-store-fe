export interface PagamentoReq {
  id?: number;
  ordineId?: number;
  totale?: number;
  metodoPagamentoId?: number;
  statoPagamento?: string;
}
