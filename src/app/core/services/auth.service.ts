import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { AccountService } from '@features/account';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly IS_LOGGED_KEY = 'isLogged';
  private readonly IS_ADMIN_KEY = 'isAdmin';

  // Signals interni (scrivibili solo dal service)
  private _isLogged = signal(false);
  private _isAdmin = signal(false);

  // Signals pubblici in sola lettura
  public readonly isLogged = this._isLogged.asReadonly();
  public readonly isAdmin = this._isAdmin.asReadonly();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private accountService: AccountService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this._isLogged.set(sessionStorage.getItem(this.IS_LOGGED_KEY) === '1');
      this._isAdmin.set(sessionStorage.getItem(this.IS_ADMIN_KEY) === '1');
    }
  }

  public setAuthenticated(): void {
    this.updateSessionStorage(this.IS_LOGGED_KEY, true);
    this.updateSessionStorage(this.IS_ADMIN_KEY, false);
    this._isLogged.set(true);
    this._isAdmin.set(false);
  }

  public setRoleAdmin(): void {
    this.updateSessionStorage(this.IS_ADMIN_KEY, true);
    this._isAdmin.set(true);
  }

  public reset(): void {
    this.updateSessionStorage(this.IS_LOGGED_KEY, false);
    this.updateSessionStorage(this.IS_ADMIN_KEY, false);
    this._isLogged.set(false);
    this._isAdmin.set(false);
    this.accountService.clearAccount();
  }

  private updateSessionStorage(key: string, value: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(key, value ? '1' : '0');
    }
  }

  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.IS_LOGGED_KEY);
      sessionStorage.removeItem(this.IS_ADMIN_KEY);
    }

    this._isLogged.set(false);
    this._isAdmin.set(false);
    this.accountService.clearAccount();
  }
}
