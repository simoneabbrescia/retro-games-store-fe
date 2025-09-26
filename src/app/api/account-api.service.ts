import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private readonly baseUrl = `${environment.apiUrl}/accounts`;

  constructor(protected http: HttpClient) {}

  public create(body: {}) {
    return this.http.post<any>(this.baseUrl + '/create', body);
  }

   /**
   * Recupera i dettagli account per ID
   */
  getById(accountId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-by-id?id=${accountId}`);
  }

  /**
   * Aggiorna le informazioni account
   */
  updateAccount(body: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update`, body);
  }

  /**
   * Aggiorna la password
   */
  changePassword(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/change-password`, body);
  }
}
