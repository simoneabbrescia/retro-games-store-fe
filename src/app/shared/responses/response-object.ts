import { ResponseBase } from './response-base';

export interface ResponseObject<T> extends ResponseBase {
  dati: T;
}
