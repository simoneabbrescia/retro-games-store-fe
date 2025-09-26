import { IndirizzoReq } from '@features/indirizzo';
import { PagamentoReq } from '@features/pagamento';

export interface OrdineReq {
  id?: number;
  statoOrdine?: string;
  accountId?: number;
  indirizzoSpedizione?: IndirizzoReq;
  pagamento?: PagamentoReq;
}
