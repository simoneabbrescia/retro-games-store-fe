import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBase, ResponseObject } from '@core/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { AccountReq } from './dtos/account-request.dto';
import { AccountDTO } from './dtos/account-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private readonly baseUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  public create(body: AccountReq): Observable<ResponseObject<AccountDTO>> {
    return this.http.post<ResponseObject<AccountDTO>>(
      `${this.baseUrl}/create`,
      body
    );
  }

  /**
   * Recupera i dettagli account per ID
   */
  getById(id: number): Observable<ResponseObject<AccountDTO>> {
    return this.http.get<ResponseObject<AccountDTO>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Aggiorna le informazioni account
   */
  update(body: AccountReq): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(`${this.baseUrl}/update`, body);
  }
}
