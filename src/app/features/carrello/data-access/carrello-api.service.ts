import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseObject } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CarrelloDTO } from './dtos/carrello-response.dto';

@Injectable({
  providedIn: 'root',
})
export class CarrelloApiService {
  private readonly baseUrl = `${environment.apiUrl}/carrelli`;

  constructor(private http: HttpClient) {}

  public getCarrelloByAccountId(
    accountId: number
  ): Observable<ResponseObject<CarrelloDTO>> {
    let params = new HttpParams().set('accountId', accountId);

    return this.http.get<ResponseObject<CarrelloDTO>>(
      this.baseUrl + '/get-carrello-by-account',
      {
        params,
      }
    );
  }
}
