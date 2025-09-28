import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AccountService } from '../data-access/account-service.service';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private accountService: AccountService
  ) {}

  public get account() {
    return this.accountService.accountSig;
  }

  /** Logout utente */
  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
