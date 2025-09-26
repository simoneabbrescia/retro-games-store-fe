export interface MetodoPagamentoReq {
  id?: number;
  accountId?: number;
  tipoMetodoPagamentoId?: number;
  token?: string;
  metodoDefault?: boolean;
  attivo?: boolean;
}
