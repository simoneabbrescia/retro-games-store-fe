import { Injectable } from '@angular/core';
import { BaseApi } from './base-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarrelloApiService extends BaseApi{
  private readonly url = this.baseUrl + '/carrelli';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getCartByAccountID(accountId: number) {
    let params = new HttpParams().set('accountId', accountId);
    return this.http.get(this.url, { params });
  }
}
