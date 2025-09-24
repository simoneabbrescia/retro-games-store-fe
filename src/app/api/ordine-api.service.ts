import { Injectable } from '@angular/core';
import { BaseApi } from './base-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdineApiService extends BaseApi {
  private readonly url = this.baseUrl + '/ordini';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  createOrder(body: {}) {
    return this.http.post(this.url + '/create', body);
  }
}
