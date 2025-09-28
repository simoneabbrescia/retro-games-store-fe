import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services';
import { CredenzialeReq, CredenzialeService } from '@features/credenziale';

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
    private authService: AuthService,
    private router: Router,
    private credenzialeService: CredenzialeService
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
    this.authService.reset(); // Reset stato precedente
    this.accediForm.markAllAsTouched(); // Mostra errori sui singoli campi

    if (this.accediForm.invalid) return;

    this.isSubmitting = true;
    const req: CredenzialeReq = this.accediForm.value;

    this.credenzialeService.login(req).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res.success) {
          // Navigazione basata sul ruolo
          this.router.navigate([res.isAdmin ? '/admin/dashboard' : '/profilo']);
        } else {
          // Messaggio di errore proveniente dal service
          this.errorMsg = res.errorMsg;
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMsg = 'Errore server';
      },
      complete: () => {
        // Pulizia finale
        this.isSubmitting = false;
      },
    });
  }
}
