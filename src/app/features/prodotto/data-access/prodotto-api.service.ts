import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseList, ResponseObject } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ProdottoDTO } from './dtos/prodotto-response.dto';

@Injectable({
  providedIn: 'root',
})
export class ProdottoApiService {
  private readonly baseUrl = `${environment.apiUrl}/prodotti`;

  constructor(protected http: HttpClient) {}

  listActive(): Observable<ResponseList<ProdottoDTO>> {
    return this.http.get<ResponseList<ProdottoDTO>>(
      this.baseUrl + '/list-active'
    );
  }

  getById(id: number): Observable<ResponseObject<ProdottoDTO>> {
    let params = new HttpParams().set('id', id);
    return this.http.get<ResponseObject<ProdottoDTO>>(
      this.baseUrl + '/get-by-id',
      { params }
    );
  }

  listByFilter(
    id?: number,
    nome?: string,
    categoriaId?: number,
    piattaformaId?: number
  ): Observable<ResponseList<ProdottoDTO>> {
    let params = new HttpParams();

    if (id) {
      params = params.set('id', id.toString());
    }
    if (nome) {
      params = params.set('nome', nome);
    }
    if (categoriaId) {
      params = params.set('categoriaId', categoriaId);
    }
    if (piattaformaId) {
      params = params.set('piattaformaId', piattaformaId);
    }

    return this.http.get<ResponseList<ProdottoDTO>>(
      `${this.baseUrl}/list-by-filter`,
      { params }
    );
  }
}
