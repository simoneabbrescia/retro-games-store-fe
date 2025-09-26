import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdottoApiService {
  private readonly url = `${environment.apiUrl}/prodotti`;

  constructor(protected http: HttpClient) {}

  getAll() {
    return this.http.get(this.url + '/list-active');
  }

  getById(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get(this.url + '/get-by-id', { params });
  }
}
