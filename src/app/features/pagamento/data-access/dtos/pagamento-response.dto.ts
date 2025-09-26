import { MetodoPagamentoDTO } from '@features/metodo-pagamento';

export interface PagamentoDTO {
  id: number;
  ordineId: number;
  totale: number;
  metodoPagamento: MetodoPagamentoDTO;
  statoPagamento: string;
}
