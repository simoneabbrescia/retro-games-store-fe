import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarrelloApiService {
  private readonly url = `${environment.apiUrl}/carrelli`;

  constructor(protected http: HttpClient) {}

  public getCarrelloByAccountId(accountId: number): any {
    let params = new HttpParams().set('accountId', accountId);
    return this.http.get<any>(this.url + '/get-carrello-by-account', {
      params,
    });
  }
}
