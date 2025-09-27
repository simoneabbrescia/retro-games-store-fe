import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AccountApiService } from '../data-access/account-api.service';
import { AccountService } from '../data-access/account-service.service';
import { AccountDTO } from '../data-access/dtos/account-response.dto';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  // Signal privato per gestire l'account in modo reattivo
  private _account = signal<AccountDTO | null>(null);

  // Signal pubblico in sola lettura
  public readonly account = this._account.asReadonly();

  constructor(
    private authService: AuthService,
    private router: Router,
    private accountApiService: AccountApiService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadAccount();
  }

  /** Carica i dati dell'account corrente */
  private loadAccount(): void {
    const id = this.accountService.getAccountId();

    if (id === null) {
      console.warn('Nessun account loggato');
      return;
    }

    this.accountApiService.getById(id).subscribe({
      next: (response) => {
        if (response.returnCode && response.dati) {
          this._account.set(response.dati);
        } else {
          console.error('Errore nel caricamento account:', response.msg);
        }
      },
      error: (err) => {
        console.error('Errore nel caricamento account:', err);
      },
    });
  }

  /** Logout utente */
  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
