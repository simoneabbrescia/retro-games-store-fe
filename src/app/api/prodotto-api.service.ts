import { Injectable } from '@angular/core';
import { BaseApi } from './base-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProdottoApi extends BaseApi {
  private readonly url = this.baseUrl + '/prodotti';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getAll() {
    return this.http.get(this.url + '/list-active');
  }
}
