import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBase, ResponseObject } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { OrdineReq } from './dtos/ordine-request.dto';
import { OrdineDTO } from './dtos/ordine-response.dto';

@Injectable({
  providedIn: 'root',
})
export class OrdineApiService {
  private readonly baseUrl = `${environment.apiUrl}/ordini`;

  constructor(private http: HttpClient) {}

  createOrder(req: OrdineReq): Observable<ResponseObject<OrdineDTO>> {
    return this.http.post<ResponseObject<OrdineDTO>>(
      `${this.baseUrl}/create`,
      req
    );
  }

  updateStatus(req: OrdineReq): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(`${this.baseUrl}/update-status`, req);
  }
}
