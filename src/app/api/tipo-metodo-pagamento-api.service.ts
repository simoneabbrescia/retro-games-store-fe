import { Injectable } from '@angular/core';
import { BaseApi } from './base-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TipoMetodoPagamentoApi extends BaseApi {
  private readonly url = this.baseUrl + '/tipi-metodo-pagamento';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getAll() {
    return this.http.get(this.url + '/list-active');
  }
}
