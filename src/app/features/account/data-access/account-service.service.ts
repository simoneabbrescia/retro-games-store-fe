import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ResponseObject } from '@core/types';
import { Observable, tap } from 'rxjs';
import { AccountApiService } from './account-api.service';
import { AccountDTO } from './dtos/account-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  // Signal privato per gestire l'account in modo reattivo
  private _accountId = signal<number | null>(null);
  private _account = signal<AccountDTO | null>(null);

  // Signal pubblico in sola lettura
  public readonly accountIdSig = this._accountId.asReadonly();
  public readonly accountSig = this._account.asReadonly();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private accountApiService: AccountApiService
  ) {
    // Recupera accountId da sessionStorage se presente
    if (isPlatformBrowser(this.platformId)) {
      const storedId = sessionStorage.getItem('accountId');
      if (storedId) {
        this._accountId.set(Number(storedId));
        this.loadAccount(Number(storedId)).subscribe();
      }
    }
  }

  private loadAccount(id: number): Observable<ResponseObject<AccountDTO>> {
    return this.accountApiService.getById(id).pipe(
      tap((res: ResponseObject<AccountDTO>) => {
        if (res.returnCode && res.dati) {
          this._account.set(res.dati);
        } else {
          console.error('Errore nel caricamento account:', res.msg);
          this._account.set(null);
        }
      })
    );
  }

  /** Imposta accountId, aggiorna sessionStorage e ritorna l’account caricato */
  public setAccountId(id: number): Observable<ResponseObject<AccountDTO>> {
    this._accountId.set(id);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('accountId', id.toString());
    }
    return this.loadAccount(id);
  }

  /** Pulisce accountId (usato al logout) */
  public clearAccount(): void {
    this._accountId.set(null);
    this._account.set(null);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('accountId');
    }
  }

  public getAccountId(): number {
    const id = this.accountIdSig();
    if (id === null) {
      throw new Error('AccountId non disponibile: utente non loggato');
    }
    return id;
  }

  public get account(): AccountDTO | null {
    return this._account();
  }

  public get isAdmin(): boolean {
    return this._account()?.ruolo?.id === 1;
  }

  public get isUser(): boolean {
    return this._account()?.ruolo?.id === 2;
  }
}
