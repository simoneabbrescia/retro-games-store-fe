import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ResponseObject } from '@core/types';
import {
  AccountApiService,
  AccountDTO,
  AccountReq,
  AccountService,
} from '@features/account';
import {
  CredenzialeApiService,
  CredenzialeDTO,
  CredenzialeReq,
} from '@features/credenziale';
import { RegisterFormAccount } from '../types/register-form.model';

@Component({
  selector: 'app-registrati',
  standalone: false,
  templateUrl: './registrati.component.html',
  styleUrls: ['./registrati.component.css'],
})
export class RegistratiComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private accountApiService = inject(AccountApiService);
  private credenzialeApiService = inject(CredenzialeApiService);

  /** UI state */
  errorMsg = '';
  successMsg = '';

  /** Form principale con 2 gruppi (per stepper linear) */
  registerForm = this.fb.group({
    account: this.fb.group({
      nome: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        // Lettere (anche accentate), spazi, apostrofo, trattino
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/),
      ]),
      cognome: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/),
      ]),
      via: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80),
        // Consenti numeri e simboli semplici di indirizzo
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9'°., /-]+$/),
      ]),
      citta: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/),
      ]),
      cap: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.pattern('^[0-9]{5}$'),
      ]),
      nazione: this.fb.nonNullable.control('Italia', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(56), // lunghezza massima nomi nazioni
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/),
      ]),
    }),
    credentials: this.fb.group({
      email: this.fb.nonNullable.control('', {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(254), // RFC limite pratico
        ],
        updateOn: 'blur',
      }),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        // Almeno una minuscola, una maiuscola, un numero e un simbolo
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/),
      ]),
    }),
  });

  ngOnInit(): void {}

  /** Helper per errori nei campi */
  hasError(path: string, error: string): boolean {
    const ctrl = this.registerForm.get(path);
    return !!ctrl && ctrl.touched && ctrl.hasError(error);
  }

  onSubmit(): void {
    this.errorMsg = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const account = this.registerForm.get('account')!
      .value as RegisterFormAccount;
    const credentials = this.registerForm.get('credentials')!
      .value as CredenzialeReq;

    const accountBody: AccountReq = {
      nome: account.nome,
      cognome: account.cognome,
      indirizzo: {
        via: account.via,
        citta: account.citta,
        cap: account.cap,
        paese: account.nazione,
      },
      ruoloId: 2,
    };

    this.credenzialeApiService.create(credentials).subscribe({
      next: (res: ResponseObject<CredenzialeDTO>) => {
        if (res.returnCode) {
          accountBody.credenzialeId = res.dati.id;
          this.createAccount(accountBody);
        } else {
          this.errorMsg = res.msg || 'Registrazione non riuscita. Riprova.';
          console.error(
            'Errore nella creazione della credenziale:',
            this.errorMsg
          );
        }
      },
      error: (err: any) => {
        this.errorMsg =
          err?.error?.message || 'Registrazione non riuscita. Riprova.';
        console.error(
          'Errore nella creazione della credenziale:',
          this.errorMsg
        );
      },
    });
  }

  private createAccount(req: AccountReq) {
    this.accountApiService.create(req).subscribe({
      next: (res: ResponseObject<AccountDTO>) => {
        if (res.returnCode) {
          this.successMsg = 'Account creato con successo!';
          this.accountService.setAccountId(res.dati.id); // Salva accountId
          this.authService.setAuthenticated();
          setTimeout(() => this.router.navigate(['/home']), 1000);
        } else {
          this.errorMsg = res.msg || 'Registrazione non riuscita. Riprova.';
          console.error("Errore nella creazione dell'account:", this.errorMsg);
        }
      },
      error: (err: any) => {
        this.errorMsg =
          err?.error?.message || 'Registrazione non riuscita. Riprova.';
        console.error("Errore nella creazione dell'account:", this.errorMsg);
      },
    });
  }
}
