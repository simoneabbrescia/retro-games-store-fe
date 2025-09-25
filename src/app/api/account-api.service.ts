import { Injectable } from '@angular/core';
import { BaseApi } from './base-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountApi extends BaseApi{
  private readonly url = this.baseUrl + '/accounts';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  public create(body: {}) {
    return this.http.post<any>(this.url + '/create', body);
  }
}
