import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredenzialeApiService } from '@features/credenziale/data-access/credenziale-api.service';
import { AccountApiService } from 'app/api/account-api.service';
import { AuthService } from 'app/auth/auth.service';

@Component({
  selector: 'app-registrati',
  standalone: false,
  templateUrl: './registrati.component.html',
  styleUrls: ['./registrati.component.css'],
})
export class RegistratiComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private accountApi = inject(AccountApiService);
  private credenzialeApi = inject(CredenzialeApiService);
  private authService = inject(AuthService);

  /** UI state */
  errorMsg = '';
  successMsg = '';

  /** Form principale con 2 gruppi (per stepper linear) */
  registerForm = this.fb.group({
    personal: this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      via: ['', Validators.required],
      citta: ['', Validators.required],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      nazione: ['Italia', Validators.required],
    }),
    credentials: this.fb.group({
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          updateOn: 'blur',
        },
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
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

    const personal = this.registerForm.get('personal')!.value as any;
    const credentials = this.registerForm.get('credentials')!.value as any;

    const accountBody = {
      nome: personal.nome,
      cognome: personal.cognome,
      indirizzo: {
        via: personal.via,
        citta: personal.citta,
        cap: personal.cap,
        paese: personal.nazione,
      },
      ruoloId: 2,
    };
    const credenzialeBody = {
      email: credentials.email,
      password: credentials.password,
    };
    let credenzialeId: number;
    this.credenzialeApi.create(credenzialeBody).subscribe({
      next: (response: any) => {
        if (response.returnCode) {
          credenzialeId = response.dati.id;
          this.createAccount(accountBody, credenzialeId);
        } else {
          this.errorMsg =
            response.msg || 'Registrazione non riuscita. Riprova.';
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

  private createAccount(body: {}, credenzialeId: number) {
    this.accountApi.create({ ...body, credenzialeId }).subscribe({
      next: (response: any) => {
        if (response.returnCode) {
          this.successMsg = 'Account creato con successo!';
          this.authService.setAccountId(response.dati.accountId); // Salva accountId
          this.authService.setAuthenticated();
          setTimeout(() => this.router.navigate(['home']), 1000);
        } else {
          this.errorMsg =
            response.msg || 'Registrazione non riuscita. Riprova.';
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
