import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBase } from '@core/types';
import { CarrelloRigaReq } from '@features/carrello-riga';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarrelloRigaApiService {
  private readonly baseUrl = `${environment.apiUrl}/carrello-righe`;

  constructor(private http: HttpClient) {}

  public addProductToCart(req: CarrelloRigaReq): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(`${this.baseUrl}/add-product`, req);
  }

  public removeProductFromCart(req: CarrelloRigaReq): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(`${this.baseUrl}/remove-product`, req);
  }

  public updateRow(req: CarrelloRigaReq): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(`${this.baseUrl}/update-row`, req);
  }
}
