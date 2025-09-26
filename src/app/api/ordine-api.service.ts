import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdineApiService {
  private readonly url = `${environment.apiUrl}/ordini`;

  constructor(protected http: HttpClient) {}

  createOrder(body: {}) {
    return this.http.post(this.url + '/create', body);
  }
}
