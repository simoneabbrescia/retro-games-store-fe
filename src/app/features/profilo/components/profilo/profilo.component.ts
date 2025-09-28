import { Component, OnInit } from '@angular/core';
import { ResponseObject } from '@core/types/response-object';
import {
  AccountApiService,
  AccountDTO,
  AccountService,
} from '@features/account';

@Component({
  selector: 'app-profilo',
  standalone: false,
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css',
})
export class ProfiloComponent implements OnInit {
  public account!: AccountDTO;

  constructor(
    private accountApiService: AccountApiService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.fetchAccount();
  }

  private fetchAccount(): void {
    this.accountApiService
      .getById(this.accountService.getAccountId())
      .subscribe({
        next: (res: ResponseObject<AccountDTO>) => {
          if (!res.returnCode) {
            console.error(
              "[Checkout] Errore nel recupero dell'account:",
              res.msg
            );
            return;
          }
          this.account = res.dati;
        },
        error: (err) =>
          console.error("[Checkout] Errore nel recupero dell'account:", err),
      });
  }

  public getNameInitials(): string {
    let initials = this.account.nome[0].charAt(0).toUpperCase();
    if (this.account.cognome[0]) {
      initials += this.account.cognome[0].charAt(0).toUpperCase();
    }
    return initials;
  }

  public onLogout(): void {}
}
