import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseList } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { RuoloDTO } from './dtos/ruolo-response.dto';

@Injectable({
  providedIn: 'root',
})
export class RuoloApiService {
  private readonly baseUrl = `${environment.apiUrl}/ruoli`;

  constructor(private http: HttpClient) {}

  public listActive(): Observable<ResponseList<RuoloDTO>> {
    return this.http.get<ResponseList<RuoloDTO>>(this.baseUrl + '/list-active');
  }
}
