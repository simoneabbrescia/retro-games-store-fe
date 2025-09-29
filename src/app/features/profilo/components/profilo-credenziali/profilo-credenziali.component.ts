import { Component, Inject, OnInit } from '@angular/core';
import { ProfiloComponent } from '../profilo/profilo.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountDTO } from '@features/account/data-access/dtos/account-response.dto';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/services';
import {
  AccountApiService,
  AccountReq,
  AccountService,
} from '@features/account';
import { Router } from '@angular/router';
import { ResponseBase, ResponseObject } from '@core/types';
import { CredenzialeApiService, CredenzialeReq } from '@features/credenziale';
import { Observable, forkJoin, of, throwError, firstValueFrom } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-profilo-credenziali',
  standalone: false,
  templateUrl: './profilo-credenziali.component.html',
  styleUrls: ['./profilo-credenziali.component.css'],
})
export class ProfiloCredenzialiComponent implements OnInit {
  public account?: AccountDTO;
  public isEditing = false;
  public infoForm!: FormGroup;
  public isSaving = false;

  constructor(
    private accountApiService: AccountApiService,
    private accountService: AccountService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private credenzialeApiService: CredenzialeApiService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.fetchAccount();
    this.setReadOnly(true);
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
          this.populateFormFromAccount();
        },
        error: (err) =>
          console.error("[Checkout] Errore nel recupero dell'account:", err),
      });
  }

  private loadForm() {
    this.infoForm = this.fb.group({
      email: this.fb.nonNullable.control('', {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(254),
        ],
      }),
      password: this.fb.nonNullable.control('', [
        Validators.minLength(8),
        Validators.maxLength(254),
      ]),
    });
  }

  private populateFormFromAccount(): void {
    if (!this.account) return;
    this.infoForm.patchValue({
      email: this.account.credenziale.email ?? '',
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  setReadOnly(readonly: boolean) {
    this.isEditing = !readonly;
    if (readonly) {
      this.infoForm.disable({ emitEvent: false });
    } else {
      this.infoForm.enable({ emitEvent: false });
    }
  }

  onEdit() {
    this.setReadOnly(false);
  }

  onCancel() {
    this.populateFormFromAccount();
    this.setReadOnly(true);
  }

  async onSave() {
    if (this.infoForm.invalid || !this.account || this.isSaving) return;

    const email = this.infoForm.get('email')?.value;
    const password = this.infoForm.get('password')?.value;
    const promises: Promise<void>[] = [];
    if (email && email !== this.account.credenziale.email) {
      promises.push(this.updateEmailAsync(email));
    }
    if (password) {
      promises.push(this.updatePasswordAsync(password));
    }
    if (promises.length === 0) {
      this.setReadOnly(true);
      return;
    }
    this.isSaving = true;
    this.infoForm.disable({ emitEvent: false });
    try {
      // Eseguo in parallelo (se vuoi in sequenza basta usare await singolarmente in ordine)
      await Promise.all(promises);
      this.snackbar.open('Credenziali aggiornate con successo.', 'Chiudi', {
        duration: 5000,
        panelClass: ['snackbar-success'],
      });
      this.infoForm.get('password')?.reset();
      this.fetchAccount();
      this.setReadOnly(true);
    } catch (err) {
      console.error('[Profilo] Errore aggiornamento credenziali:', err);
      this.snackbar.open("Errore durante l'aggiornamento delle credenziali.", 'Chiudi', {
        duration: 6000,
        panelClass: ['snackbar-error'],
      });
      this.infoForm.enable({ emitEvent: false });
    } finally {
      this.isSaving = false;
    }
  }

  private async updateEmailAsync(email: string): Promise<void> {
    const body: CredenzialeReq = {
      id: this.account?.credenziale.id,
      email,
    };
    const response = await firstValueFrom(this.credenzialeApiService.updateEmail(body));
    if (!response.returnCode) {
      throw new Error(response.msg || 'Aggiornamento email fallito');
    }
  }

  private async updatePasswordAsync(password: string): Promise<void> {
    const body: CredenzialeReq = {
      id: this.account?.credenziale.id,
      password,
    };
    const response = await firstValueFrom(this.credenzialeApiService.updatePassword(body));
    if (!response.returnCode) {
      throw new Error(response.msg || 'Aggiornamento password fallito');
    }
  }
}
