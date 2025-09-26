import { IndirizzoDTO } from '@features/indirizzo';
import { OrdineRigaDTO } from '@features/ordine-riga';
import { PagamentoDTO } from '@features/pagamento';

export interface OrdineDTO {
  id: number;
  statoOrdine: string;
  accountId: number;
  righe: OrdineRigaDTO[];
  indirizzoSpedizione: IndirizzoDTO;
  pagamento: PagamentoDTO;
  totale: number;
  totaleQuantita: number;
}
