import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CredenzialeApiService {
  private baseUrl = `${environment.apiUrl}/credenziali`;

  constructor(private http: HttpClient) {}

  create(body: {}) {
    return this.http.post(`${this.baseUrl}/create`, body);
  }

  login(body: {}) {
    return this.http.post(`${this.baseUrl}/login`, body);
  }
}
