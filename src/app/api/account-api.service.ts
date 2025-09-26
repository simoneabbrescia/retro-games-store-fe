import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private readonly url = `${environment.apiUrl}/accounts`;

  constructor(protected http: HttpClient) {}

  public create(body: {}) {
    return this.http.post<any>(this.url + '/create', body);
  }
}
