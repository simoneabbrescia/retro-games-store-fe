import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseList } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CategoriaDTO } from './dtos/categoria-response.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoriaApiService {
  private readonly baseUrl = `${environment.apiUrl}/categorie`;

  constructor(private http: HttpClient) {}

  listActive(): Observable<ResponseList<CategoriaDTO>> {
    return this.http.get<ResponseList<CategoriaDTO>>(
      this.baseUrl + '/list-active'
    );
  }
}
