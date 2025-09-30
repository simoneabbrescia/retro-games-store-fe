import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBase, ResponseObject } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { MetodoPagamentoReq } from './dtos/metodo-pagamento-request.dto';
import { MetodoPagamentoDTO } from './dtos/metodo-pagamento-response.dto';

@Injectable({
  providedIn: 'root',
})
export class MetodoPagamentoApiService {
  private readonly baseUrl = `${environment.apiUrl}/metodi-pagamento`;

  constructor(private http: HttpClient) {}

  create(
    req: MetodoPagamentoReq
  ): Observable<ResponseObject<MetodoPagamentoDTO>> {
    return this.http.post<ResponseObject<MetodoPagamentoDTO>>(
      `${this.baseUrl}/create`,
      req
    );
  }

  getAllByAccountId(
    accountId: number
  ): Observable<ResponseObject<MetodoPagamentoDTO[]>> {
    const httpParams = new HttpParams().set('accountId', accountId.toString());
    return this.http.get<ResponseObject<MetodoPagamentoDTO[]>>(
      `${this.baseUrl}/list-active-by-account-id`,
      { params: httpParams }
    );
  }

  disable(req: MetodoPagamentoReq): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(`${this.baseUrl}/disable`, req);
  }
}
