import { ResponseBase } from './response-base';

export interface ResponseList<T> extends ResponseBase {
  dati: T[];
}
