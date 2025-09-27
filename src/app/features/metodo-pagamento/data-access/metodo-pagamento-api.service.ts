import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseObject } from '@core/types';
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

  create(req: MetodoPagamentoReq): Observable<ResponseObject<MetodoPagamentoDTO>> {
    return this.http.post<ResponseObject<MetodoPagamentoDTO>>(
      `${this.baseUrl}/create`,
      req
    );
  }
}
