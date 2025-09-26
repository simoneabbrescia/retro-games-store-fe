import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseList } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { PiattaformaDTO } from './dtos/piattaforma-response.dto';

@Injectable({
  providedIn: 'root',
})
export class PiattaformaApiService {
  private readonly baseUrl = `${environment.apiUrl}/piattaforme`;

  constructor(private http: HttpClient) {}

  listActive(): Observable<ResponseList<PiattaformaDTO>> {
    return this.http.get<ResponseList<PiattaformaDTO>>(
      this.baseUrl + '/list-active'
    );
  }
}
