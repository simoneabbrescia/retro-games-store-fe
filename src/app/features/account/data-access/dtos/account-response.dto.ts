import { CarrelloDTO } from '@features/carrello';
import { CredenzialeDTO } from '@features/credenziale';
import { IndirizzoDTO } from '@features/indirizzo';
import { MetodoPagamentoDTO } from '@features/metodo-pagamento';

export interface AccountDTO {
  id: number;
  nome: string;
  cognome: string;
  indirizzo: IndirizzoDTO;
  metodiPagamento: MetodoPagamentoDTO[];
  ruolo: string;
  credenziale: CredenzialeDTO;
  carrello: CarrelloDTO;
  attivo: boolean;
}
