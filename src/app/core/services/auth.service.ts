import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { AccountService } from '@features/account';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly IS_LOGGED_KEY = 'isLogged';

  // Signals interni (scrivibili solo dal service)
  private _isLogged = signal(false);
  private _isAdmin = signal(false);

  // Signals pubblici in sola lettura
  public readonly isLoggedSig = this._isLogged.asReadonly();
  public readonly isAdminSig = this._isAdmin.asReadonly();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private accountService: AccountService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this._isLogged.set(sessionStorage.getItem(this.IS_LOGGED_KEY) === '1');
    }
  }

  public get isLogged(): boolean {
    return this._isLogged();
  }

  public get isAdmin(): boolean {
    return this._isAdmin();
  }

  public setAuthenticated(isAdmin = false): void {
    this._isLogged.set(true);
    this._isAdmin.set(isAdmin);
    this.updateSessionStorage(this.IS_LOGGED_KEY, true);
  }

  public reset(): void {
    this._isLogged.set(false);
    this._isAdmin.set(false);
    this.updateSessionStorage(this.IS_LOGGED_KEY, false);
    this.accountService.clearAccount();
  }

  private updateSessionStorage(key: string, value: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(key, value ? '1' : '0');
    }
  }

  public logout(): void {
    this.reset();
  }
}
