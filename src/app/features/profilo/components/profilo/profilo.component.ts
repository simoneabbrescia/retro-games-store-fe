import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@core/layout/confirm-dialog/confirm-dialog.component';
import { AuthService } from '@core/services';
import { ResponseBase } from '@core/types';
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
  public account?: AccountDTO;

  constructor(
    private accountApiService: AccountApiService,
    private accountService: AccountService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar
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

  public getNameInitials(): string | undefined {
    let initials = this.account?.nome[0].charAt(0).toUpperCase();
    if (this.account?.cognome[0]) {
      initials += this.account?.cognome[0].charAt(0).toUpperCase();
    }
    return initials;
  }

  public onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Logout',
        message: 'Sei sicuro di voler uscire dall\'account?',
        confirmText: 'Esci',
        cancelText: 'Annulla',
        icon: 'logout'
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.authService.logout();
        this.router.navigate(['/accedi']);
      }
    });
  }

  public onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Elimina account',
        message: 'Sei sicuro di voler eliminare il tuo account? Questa operazione è irreversibile.',
        confirmText: 'Elimina',
        cancelText: 'Annulla',
        icon: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.accountApiService.disable(this.account!).subscribe({
        next: (response: ResponseBase) => {
          if (response.returnCode) {
            this.authService.logout();
            this.snackbar.open('Account eliminato con successo.', 'Chiudi', {
              duration: 5000,
            });
            this.router.navigate(['/accedi']);
          } else {
            console.error('Errore durante l\'eliminazione dell\'account', response.msg);
            this.snackbar.open('Errore durante l\'eliminazione dell\'account.', 'Chiudi', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          }
        },
        error: (err: any) => {
          console.error('Errore durante la disabilitazione dell\'account', err);
          this.snackbar.open('Errore durante l\'eliminazione dell\'account.', 'Chiudi', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
      });
    });
  }
}
