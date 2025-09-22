import { Injectable } from '@angular/core';
import { BaseApi } from './base-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarrelloApi extends BaseApi{
  private readonly url = this.baseUrl + '/carrelli';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  public getCarrelloByAccountId(accountId: number): any {
    let params = new HttpParams().set('accountId', accountId);
    return this.http.get<any>(this.url + '/get-carrello-by-account', { params });
  }
}
