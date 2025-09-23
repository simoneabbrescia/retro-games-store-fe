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

  public addProductToCart(body: {}) {
    return this.http.post<any>(`${this.url}/add-product`, body);
  }

  public removeProductFromCart(body: {}) {
    return this.http.post<any>(`${this.url}/remove-product`, body);
  }

  public updateRiga(body: {}) {
    return this.http.put<any>(`${this.url}/update-row`, body);
  }
}
