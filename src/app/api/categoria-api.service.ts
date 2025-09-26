import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaApiService {
  private readonly url = `${environment.apiUrl}/categorie`;

  constructor(protected http: HttpClient) {}

  getAll() {
    return this.http.get(this.url + '/list-active');
  }
}
