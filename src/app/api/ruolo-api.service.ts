import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RuoloApiService {
  private readonly url = `${environment.apiUrl}/ruoli`;

  constructor(protected http: HttpClient) {}

  public getAll() {
    return this.http.get<any>(this.url + '/list-active');
  }
}
