import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLogged = true;
  private accountId: number = 1;

  constructor() { }

  public isLoggedIn(): boolean {
    return this.isLogged;
  }

  public getAccountId(): number {
    return this.accountId;
  }
}
