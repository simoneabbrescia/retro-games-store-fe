import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseList } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { TipoMetodoPagamentoDTO } from './dtos/tipo-metodo-pagamento-response.dto';

@Injectable({
  providedIn: 'root',
})
export class TipoMetodoPagamentoApiService {
  private readonly baseUrl = `${environment.apiUrl}/tipi-metodo-pagamento`;

  constructor(private http: HttpClient) {}

  listActive(): Observable<ResponseList<TipoMetodoPagamentoDTO>> {
    return this.http.get<ResponseList<TipoMetodoPagamentoDTO>>(
      this.baseUrl + '/list-active'
    );
  }
}
