import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AccountApiService } from '../../api/account-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profilo',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  public account: any = {};

  constructor(
    private authService: AuthService,
    private accountApiService: AccountApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccount();
  }

  private loadAccount() {
    const accountId = this.authService.getAccountId();

    if (!accountId) {
      console.warn('Nessun account loggato');
      return;
    }

    this.accountApiService.getById(accountId).subscribe(
      (response: any) => {
        if (response.returnCode) {
          this.account = response.dati;
        } else {
          console.error('Errore nel caricamento account:', response.msg);
        }
      },
      (error: any) => {
        console.error('Errore durante il caricamento account:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
