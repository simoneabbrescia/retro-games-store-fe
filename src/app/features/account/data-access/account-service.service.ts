import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  // Signal privato per accountId
  private _accountId = signal<number | null>(null);

  // Signal pubblico in sola lettura
  public readonly accountId = this._accountId.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Recupera accountId da sessionStorage se presente
    if (isPlatformBrowser(this.platformId)) {
      const storedId = sessionStorage.getItem('accountId');
      if (storedId) {
        this._accountId.set(Number(storedId));
      }
    }
  }

  public getAccountId(): number {
    const id = this.accountId();
    if (id === null) {
      throw new Error('AccountId non disponibile: utente non loggato');
    }
    return id;
  }

  /** Imposta accountId e aggiorna sessionStorage */
  public setAccountId(id: number): void {
    this._accountId.set(id);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('accountId', id.toString());
    }
  }

  /** Pulisce accountId (usato al logout) */
  public clearAccount(): void {
    this._accountId.set(null);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('accountId');
    }
  }
}
