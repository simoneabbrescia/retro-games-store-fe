import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '@features/account';
import { CredenzialeApiService } from '@features/credenziale';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-accedi',
  standalone: false,
  templateUrl: './accedi.component.html',
  styleUrl: './accedi.component.css',
})
export class AccediComponent implements OnInit {
  accediForm!: FormGroup;
  errorMsg: string = '';
  isSubmitting: boolean = false;

  constructor(
    private auth: AuthService,
    private accountService: AccountService,
    private router: Router,
    private credenziale: CredenzialeApiService
  ) {}

  ngOnInit(): void {
    this.accediForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  /** Restituisce il messaggio di errore per ogni campo */
  getErrorMessage(controlName: string): string {
    const control = this.accediForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    switch (controlName) {
      case 'email': {
        if (control.errors['required']) {
          return 'Email obbligatoria';
        }

        if (control.errors['email']) {
          return 'Email non valida';
        }
        break;
      }

      case 'password': {
        if (control.errors['required']) {
          return 'Password obbligatoria';
        }
        if (control.errors['minlength']) {
          const len = control.errors['minlength'].requiredLength;
          return `Password deve avere almeno ${len} caratteri`;
        }
        break;
      }

      default:
        return '';
    }

    return '';
  }

  onSubmit(): void {
    this.auth.reset(); // Reset stato precedente
    this.accediForm.markAllAsTouched(); // Mostra errori sui singoli campi

    // Blocca se il form non è valido
    if (this.accediForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.accediForm.value;

    this.credenziale.login({ email, password }).subscribe({
      next: (res: any) => {
        // Controllo returnCode dal backend
        if (res.returnCode) {
          // Login riuscito
          this.accountService.setAccountId(res.dati.accountId); // Salva accountId
          this.auth.setAuthenticated();

          this.router.navigate(['/home']);
        } else {
          this.errorMsg = 'Credenziali errate';
          this.isSubmitting = false;
        }
      },
      error: (err) => {
        // Errore backend
        this.errorMsg = err?.error?.message || 'Errore server';
        this.isSubmitting = false;
      },
      complete: () => {
        // Pulizia finale
        this.isSubmitting = false;
      },
    });
  }
}
