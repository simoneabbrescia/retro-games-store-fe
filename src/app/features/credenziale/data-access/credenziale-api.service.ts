import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBase, ResponseObject } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CredenzialeReq } from './dtos/credenziale-request.dto';
import { CredenzialeDTO } from './dtos/credenziale-response.dto';

@Injectable({
  providedIn: 'root',
})
export class CredenzialeApiService {
  private readonly baseUrl = `${environment.apiUrl}/credenziali`;

  constructor(private http: HttpClient) {}

  create(req: CredenzialeReq): Observable<ResponseObject<CredenzialeDTO>> {
    return this.http.post<ResponseObject<CredenzialeDTO>>(
      `${this.baseUrl}/create`,
      req
    );
  }

  login(req: CredenzialeReq): Observable<ResponseObject<CredenzialeDTO>> {
    return this.http.post<ResponseObject<CredenzialeDTO>>(
      `${this.baseUrl}/login`,
      req
    );
  }

  updateEmail(req: CredenzialeReq): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(`${this.baseUrl}/update-email`, req);
  }

  updatePassword(req: CredenzialeReq): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(`${this.baseUrl}/update-password`, req);
  }
}
