import { Injectable } from '@angular/core';
import { BaseApi } from './base-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RuoloApi extends BaseApi{
  private readonly url = this.baseUrl + '/ruoli';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  public getAll() {
    return this.http.get<any>(this.url + '/list-active');
  }
}
