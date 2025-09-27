import { IndirizzoReq } from '@features/indirizzo';

export interface AccountReq {
  id?: number;
  nome?: string;
  cognome?: string;
  indirizzo?: IndirizzoReq;
  ruoloId?: number;
  credenzialeId?: number;
  attivo?: boolean;
}
