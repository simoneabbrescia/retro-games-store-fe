import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarrelloRigaApiService {
  private readonly url = `${environment.apiUrl}/carrello-righe`;

  constructor(protected http: HttpClient) {}

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
