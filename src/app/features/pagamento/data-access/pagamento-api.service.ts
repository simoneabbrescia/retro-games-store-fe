import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseObject } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { PagamentoReq } from './dtos/pagamento-request.dto';
import { PagamentoDTO } from './dtos/pagamento-response.dto';

@Injectable({
  providedIn: 'root',
})
export class PagamentoApiService {
  private readonly baseUrl = `${environment.apiUrl}/pagamenti`;

  constructor(private http: HttpClient) {}

  create(req: PagamentoReq): Observable<ResponseObject<PagamentoDTO>> {
    return this.http.post<ResponseObject<PagamentoDTO>>(
      `${this.baseUrl}/create`,
      req
    );
  }
}
