import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ResponseBase, ResponseList, ResponseObject } from '@core/types';
import {
  AccountApiService,
  AccountDTO,
  AccountService,
} from '@features/account';
import {
  MetodoPagamentoApiService,
  MetodoPagamentoDTO,
  MetodoPagamentoReq,
} from '@features/metodo-pagamento';
import {
  TipoMetodoPagamentoApiService,
  TipoMetodoPagamentoDTO,
} from '@features/tipo-metodo-pagamento';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@core/layout/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profilo-metodo-pagamento',
  standalone: false,
  templateUrl: './profilo-metodo-pagamento.component.html',
  styleUrls: ['./profilo-metodo-pagamento.component.css'],
})
export class ProfiloMetodoPagamentoComponent implements OnInit {
  account?: AccountDTO;
  metodoPagamentoDefault?: MetodoPagamentoDTO;

  pagamentoForm!: FormGroup;
  tipiMetodoPagamento: TipoMetodoPagamentoDTO[] = [];
  isSaving = false;
  isEditing = false;
  isDeleting = false; // <--- aggiunto

  // Manteniamo solo carta e PayPal
  readonly PAYMENT_METHOD_CARD_ID = '1';
  readonly PAYMENT_METHOD_PAYPAL_ID = '2';

  private readonly CARD_NUMBER_PATTERN =
    /^(?=(?:[^\d]*\d){13,19}[^\d]*$)[\d -]+$/;

  constructor(
    private accountApiService: AccountApiService,
    private accountService: AccountService,
    private metodoPagamentoApiService: MetodoPagamentoApiService,
    private tipoMetodoPagamentoApiService: TipoMetodoPagamentoApiService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchAccount();
    this.fetchPaymentMethodTypes();
  }

  private initForm(): void {
    this.pagamentoForm = this.fb.group({
      metodo: [null, Validators.required], // '1' carta, '2' paypal
      card: [''],
      email: [''],
    });
    this.pagamentoForm.disable({ emitEvent: false });
    this.pagamentoForm
      .get('metodo')
      ?.valueChanges.subscribe(() => this.applyDynamicPaymentValidators());
  }

  private fetchAccount(): void {
    this.accountApiService
      .getById(this.accountService.getAccountId())
      .subscribe({
        next: (res: ResponseObject<AccountDTO>) => {
          if (!res.returnCode) {
            console.error('[Profilo] Errore account:', res.msg);
            return;
          }
          this.account = res.dati;
          // Mantieni solo i metodi default true
          if (this.account.metodiPagamento?.length) {
            this.account.metodiPagamento = this.account.metodiPagamento.filter(
              (m) => m.metodoDefault === true
            );
          }
          this.resolveSavedPaymentMethod();
        },
        error: (err) => console.error('[Profilo] Errore account:', err),
      });
  }

  private fetchPaymentMethodTypes(): void {
    this.tipoMetodoPagamentoApiService.listActive().subscribe({
      next: (res: ResponseList<TipoMetodoPagamentoDTO>) => {
        if (!res.returnCode) {
          console.error('[Profilo] Errore tipi metodo pagamento:', res.msg);
          return;
        }
        // Filtra solo carta e PayPal
        this.tipiMetodoPagamento = res.dati.filter((t) =>
          [
            Number(this.PAYMENT_METHOD_CARD_ID),
            Number(this.PAYMENT_METHOD_PAYPAL_ID),
          ].includes(t.id)
        );
      },
      error: (err) =>
        console.error('[Profilo] Errore tipi metodo pagamento:', err),
    });
  }

  private resolveSavedPaymentMethod(): void {
    // Ora la lista è già filtrata: prendo il primo se presente
    this.metodoPagamentoDefault = this.account?.metodiPagamento?.[0];
  }

  onEdit(): void {
    this.isEditing = true;
    this.pagamentoForm.enable({ emitEvent: false });
    // Pre-popolazione se esiste
    if (this.metodoPagamentoDefault) {
      const tipoId = String(this.metodoPagamentoDefault.tipo.id);
      this.pagamentoForm.get('metodo')?.setValue(tipoId, { emitEvent: true });
      if (tipoId === this.PAYMENT_METHOD_CARD_ID) {
        this.pagamentoForm
          .get('card')
          ?.setValue(this.metodoPagamentoDefault.token);
      } else if (tipoId === this.PAYMENT_METHOD_PAYPAL_ID) {
        this.pagamentoForm
          .get('email')
          ?.setValue(this.metodoPagamentoDefault.token);
      }
    } else {
      // Nessun metodo: reset
      this.pagamentoForm.reset();
      this.pagamentoForm.get('metodo')?.setValue(this.PAYMENT_METHOD_CARD_ID, {
        emitEvent: true,
      });
    }
  }

  onCancel(): void {
    this.isEditing = false;
    this.pagamentoForm.reset();
    this.pagamentoForm.disable({ emitEvent: false });
  }

  private applyDynamicPaymentValidators(): void {
    const metodo = String(this.pagamentoForm.get('metodo')?.value ?? '');
    const cardCtrl = this.pagamentoForm.get('card');
    const emailCtrl = this.pagamentoForm.get('email');
    if (!cardCtrl || !emailCtrl) return;

    cardCtrl.clearValidators();
    emailCtrl.clearValidators();

    if (metodo === this.PAYMENT_METHOD_CARD_ID) {
      cardCtrl.setValidators([
        Validators.required,
        Validators.pattern(this.CARD_NUMBER_PATTERN),
      ]);
      emailCtrl.setValue('', { emitEvent: false });
    } else if (metodo === this.PAYMENT_METHOD_PAYPAL_ID) {
      emailCtrl.setValidators([Validators.required, Validators.email]);
      cardCtrl.setValue('', { emitEvent: false });
    }

    cardCtrl.updateValueAndValidity({ emitEvent: false });
    emailCtrl.updateValueAndValidity({ emitEvent: false });
  }

  private extractToken(): string {
    const metodo = String(this.pagamentoForm.get('metodo')?.value ?? '');
    if (metodo === this.PAYMENT_METHOD_CARD_ID)
      return String(this.pagamentoForm.get('card')?.value || '');
    if (metodo === this.PAYMENT_METHOD_PAYPAL_ID)
      return String(this.pagamentoForm.get('email')?.value || '');
    return '';
  }

  public salvaMetodo(): void {
    if (this.pagamentoForm.invalid || this.isSaving || !this.account) return;

    const metodo = String(this.pagamentoForm.get('metodo')?.value);
    const token = this.extractToken();

    // Se non è cambiato nulla esco
    if (
      this.metodoPagamentoDefault &&
      String(this.metodoPagamentoDefault.tipo.id) === metodo &&
      this.metodoPagamentoDefault.token === token
    ) {
      this.onCancel();
      return;
    }

    const req: MetodoPagamentoReq = {
      accountId: this.account.id,
      tipoMetodoPagamentoId: Number(metodo),
      token,
      metodoDefault: true,
    };

    this.isSaving = true;
    this.metodoPagamentoApiService.create(req).subscribe({
      next: (res: ResponseObject<MetodoPagamentoDTO>) => {
        if (!res.returnCode) {
          console.error('[Profilo] Errore salvataggio metodo:', res.msg);
          this.snack.open('Salvataggio non riuscito.', 'Chiudi', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
          return;
        }
        this.snack.open('Metodo aggiornato.', 'Chiudi', {
          duration: 5000,
          panelClass: ['snackbar-success'],
        });
        this.fetchAccount();
        this.onCancel();
      },
      error: (err) => {
        console.error('[Profilo] Errore salvataggio metodo:', err);
        this.snack.open('Errore durante il salvataggio.', 'Chiudi', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
      },
      complete: () => (this.isSaving = false),
    });
  }

  onDelete(): void {
    if (!this.metodoPagamentoDefault || this.isDeleting) return;

    const data: ConfirmDialogData = {
      title: 'Conferma eliminazione',
      message: 'Eliminare il metodo di pagamento salvato?',
      confirmText: 'Elimina',
      cancelText: 'Annulla',
      icon: 'delete',
    };

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        disableClose: true,
        data,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this.executeDelete();
      });
  }

  private executeDelete(): void {
    if (!this.metodoPagamentoDefault) return;
    this.isDeleting = true;
    const body: MetodoPagamentoReq = { id: this.metodoPagamentoDefault.id };
    this.metodoPagamentoApiService.disable(body).subscribe({
      next: (res: ResponseBase) => {
        if (!res.returnCode) {
            this.snack.open('Eliminazione non riuscita.', 'Chiudi', {
              duration: 5000,
              panelClass: ['snackbar-error'],
            });
            return;
        }
        this.snack.open('Metodo eliminato.', 'Chiudi', {
          duration: 4000,
          panelClass: ['snackbar-success'],
        });
        this.metodoPagamentoDefault = undefined;
        // Svuoto anche la lista locale
        if (this.account) this.account.metodiPagamento = [];
      },
      error: (err) => {
        console.error('[Profilo] Errore eliminazione metodo:', err);
        this.snack.open("Errore durante l'eliminazione.", 'Chiudi', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
      },
      complete: () => (this.isDeleting = false),
    });
  }

  get metodoLabel(): string {
    if (!this.metodoPagamentoDefault) return 'Nessun metodo';
    const id = this.metodoPagamentoDefault.tipo.id;
    if (id === Number(this.PAYMENT_METHOD_CARD_ID))
      return 'Carta (Visa, Mastercard, AMEX)';
    if (id === Number(this.PAYMENT_METHOD_PAYPAL_ID)) return 'PayPal';
    return this.metodoPagamentoDefault.tipo.nome || 'Metodo';
  }
}
