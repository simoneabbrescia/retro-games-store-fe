import { Injectable } from '@angular/core';
import { AuthService } from '@core/services';
import { ResponseObject } from '@core/types';
import { AccountService } from '@features/account';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { CredenzialeApiService } from './credenziale-api.service';
import { CredenzialeReq } from './dtos/credenziale-request.dto';
import { CredenzialeDTO } from './dtos/credenziale-response.dto';

@Injectable({ providedIn: 'root' })
export class CredenzialeService {
  constructor(
    private authService: AuthService,
    private credenzialeApiService: CredenzialeApiService,
    private accountService: AccountService
  ) {}

  login(
    req: CredenzialeReq
  ): Observable<{ success: boolean; isAdmin?: boolean; errorMsg: string }> {
    return this.credenzialeApiService.login(req).pipe(
      switchMap((res: ResponseObject<CredenzialeDTO>) => {
        if (!res.returnCode) {
          return of({ success: false, errorMsg: 'Credenziali errate' });
        }
        // Carico account
        return this.accountService.setAccountId(res.dati.accountId).pipe(
          map(() => {
            const isAdmin = this.accountService.isAdmin;
            this.authService.setAuthenticated(isAdmin);
            return { success: true, isAdmin, errorMsg: '' };
          })
        );
      }),
      catchError((err: any) =>
        of({ success: false, errorMsg: err.message || 'Errore server' })
      )
    );
  }
}
