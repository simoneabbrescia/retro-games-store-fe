import { Injectable } from '@angular/core';
import { BaseApi } from './base-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarrelloRigaApi extends BaseApi {
  private readonly url = this.baseUrl + '/carrello-righe';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // TODO: Metodo per aggiungere un prodotto al carrello
}
