import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResponseList, ResponseObject } from '@core/types';
import {
  AccountApiService,
  AccountDTO,
  AccountService,
} from '@features/account';
import { CarrelloDTO, CarrelloService } from '@features/carrello';
import { IndirizzoReq } from '@features/indirizzo';
import {
  MetodoPagamentoApiService,
  MetodoPagamentoDTO,
  MetodoPagamentoReq,
} from '@features/metodo-pagamento';
import { OrdineApiService, OrdineDTO, OrdineReq } from '@features/ordine';
import {
  PagamentoApiService,
  PagamentoDTO,
  PagamentoReq,
} from '@features/pagamento';
import {
  TipoMetodoPagamentoApiService,
  TipoMetodoPagamentoDTO,
} from '@features/tipo-metodo-pagamento';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  // DATA STATE
  carrello!: CarrelloDTO;
  account!: AccountDTO;
  tipiMetodoPagamento: TipoMetodoPagamentoDTO[] = [];
  metodoPagamentoDefault?: MetodoPagamentoDTO;

  // FORMS
  checkoutForm!: FormGroup; // Indirizzo di spedizione
  pagamentoForm!: FormGroup; // Metodo di pagamento + termini

  // UI STATE
  isSubmitting = false;

  // PAYMENT METHOD CONSTANTS (string for form binding consistency)
  readonly PAYMENT_METHOD_CARD_ID = '1';
  readonly PAYMENT_METHOD_PAYPAL_ID = '2';
  readonly PAYMENT_METHOD_BONIFICO_ID = '3';
  readonly PAYMENT_METHOD_SAVED_ID = 'default';

  // Pattern: solo cifre, spazi, trattini; tra 13 e 19 cifre totali
  private readonly CARD_NUMBER_PATTERN =
    /^(?=(?:[^\d]*\d){13,19}[^\d]*$)[\d -]+$/;
  constructor(
    private accountApiService: AccountApiService,
    private accountService: AccountService,
    private carrelloService: CarrelloService,
    private ordineApiService: OrdineApiService,
    private tipoMetodoPagamentoApiService: TipoMetodoPagamentoApiService,
    private metodoPagamentoApiService: MetodoPagamentoApiService,
    private fb: FormBuilder,
    private router: Router,
    public snack: MatSnackBar,
    private pagamentoApiService: PagamentoApiService
  ) {}

  ngOnInit(): void {
    this.initAddressForm();
    this.initPaymentForm();
    this.fetchAccount();
    this.fetchPaymentMethodTypes();
    this.refreshCarrello();
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
          this.patchAddressForm();
          this.resolveDefaultPaymentMethod();
        },
        error: (err) =>
          console.error("[Checkout] Errore nel recupero dell'account:", err),
      });
  }

  private resolveDefaultPaymentMethod(): void {
    const found = this.account?.metodiPagamento?.find((m) => m.metodoDefault);
    if (!found) return;
    this.metodoPagamentoDefault = found;
    this.pagamentoForm.get('metodo')?.setValue(this.PAYMENT_METHOD_SAVED_ID);
    this.applyDynamicPaymentValidators();
  }

  private refreshCarrello(): void {
    this.carrelloService.loadCarrello((c) => {
      if (c.totaleQuantita === 0) {
        this.router.navigate(['/home']);
        return;
      }
      this.carrello = c;
    });
  }

  private initAddressForm(): void {
    this.checkoutForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      indirizzo: ['', [Validators.required, Validators.minLength(5)]],
      citta: ['', [Validators.required, Validators.minLength(2)]],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      nazione: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  private patchAddressForm(): void {
    if (!this.account) return;
    const { indirizzo } = this.account as any;
    this.checkoutForm.patchValue({
      nome: this.account.nome ?? '',
      cognome: this.account.cognome ?? '',
      indirizzo: indirizzo?.via ?? '',
      citta: indirizzo?.citta ?? '',
      cap: indirizzo?.cap ?? '',
      nazione: indirizzo?.paese ?? '',
    });
  }

  private initPaymentForm(): void {
    this.pagamentoForm = this.fb.group({
      metodo: [null, Validators.required],
      card: [''],
      email: [''],
      terms: [false, Validators.requiredTrue],
    });

    this.pagamentoForm
      .get('metodo')
      ?.valueChanges.subscribe(() => this.applyDynamicPaymentValidators());
  }

  private fetchPaymentMethodTypes(): void {
    this.tipoMetodoPagamentoApiService.listActive().subscribe({
      next: (res: ResponseList<TipoMetodoPagamentoDTO>) => {
        if (!res.returnCode) {
          console.error(
            '[Checkout] Errore nel recupero dei metodi di pagamento:',
            res.msg
          );
          return;
        }
        this.tipiMetodoPagamento = res.dati;
        if (!this.metodoPagamentoDefault && this.tipiMetodoPagamento.length) {
          const initial = String(this.tipiMetodoPagamento[0].id);
          this.pagamentoForm.get('metodo')?.setValue(initial);
          this.applyDynamicPaymentValidators();
        }
      },
      error: (err) =>
        console.error(
          '[Checkout] Errore nel recupero dei metodi di pagamento:',
          err
        ),
    });
  }

  public paymentStepInvalid(): boolean {
    return this.pagamentoForm.invalid;
  }

  private applyDynamicPaymentValidators(): void {
    const metodo = String(this.pagamentoForm.get('metodo')?.value ?? '');
    const cardCtrl = this.pagamentoForm.get('card');
    const emailCtrl = this.pagamentoForm.get('email');
    if (!cardCtrl || !emailCtrl) return;

    cardCtrl.clearValidators();
    emailCtrl.clearValidators();

    switch (metodo) {
      case this.PAYMENT_METHOD_CARD_ID:
        cardCtrl.setValidators([
          Validators.required,
          Validators.pattern(this.CARD_NUMBER_PATTERN),
        ]);
        emailCtrl.setValue('', { emitEvent: false });
        break;
      case this.PAYMENT_METHOD_PAYPAL_ID:
        emailCtrl.setValidators([Validators.required, Validators.email]);
        cardCtrl.setValue('', { emitEvent: false });
        break;
      case this.PAYMENT_METHOD_BONIFICO_ID:
      case this.PAYMENT_METHOD_SAVED_ID:
        cardCtrl.setValue('', { emitEvent: false });
        emailCtrl.setValue('', { emitEvent: false });
        break;
      default:
        break;
    }

    cardCtrl.updateValueAndValidity({ emitEvent: false });
    emailCtrl.updateValueAndValidity({ emitEvent: false });
  }

  public onSubmit(): void {
    if (
      this.checkoutForm.invalid ||
      this.pagamentoForm.invalid ||
      this.isSubmitting
    )
      return;
    this.isSubmitting = true;
    (async () => {
      try {
        // 1. Crea ordine
        const ordineId = await firstValueFrom(this.createOrder());
        // 2. Recupera o crea metodo di pagamento
        const metodoId = await firstValueFrom(this.getOrCreatePaymentMethod());
        // 3. Esegue pagamento
        await firstValueFrom(this.executePayment(metodoId, ordineId));
        // 4. Aggiorna stato ordine
        this.ordineApiService.updateStatus({
          id: ordineId,
          statoOrdine: 'PAGATO',
        });
        // 5. Successo
        this.snack.open('Ordine effettuato con successo!', 'Chiudi', {
          duration: 5000,
          panelClass: ['snackbar-success'],
        });
        this.router.navigate(['/home']);
      } catch (err) {
        this.snack.open(
          'Si è verificato un errore nel processo di checkout. Riprova.',
          'Chiudi',
          { duration: 6000 }
        );
        console.error('[Checkout] Errore nel processo di checkout:', err);
      } finally {
        this.isSubmitting = false;
      }
    })();
  }

  /**
   * Crea (se necessario) un nuovo metodo di pagamento e restituisce un Observable con il suo id.
   * Se esiste un metodo default selezionato (radio = "default"), ritorna direttamente il suo id.
   */
  private getOrCreatePaymentMethod(): Observable<number> {
    const metodoFormValue = this.pagamentoForm.get('metodo')?.value;
    if (
      this.metodoPagamentoDefault &&
      metodoFormValue === this.PAYMENT_METHOD_SAVED_ID
    ) {
      return of(this.metodoPagamentoDefault.id);
    }

    const metodoValue = String(metodoFormValue);
    const req: MetodoPagamentoReq = {
      accountId: this.accountService.getAccountId(),
      tipoMetodoPagamentoId: +metodoValue,
      token: this.extractPaymentToken(metodoValue),
      metodoDefault: false,
      attivo: true,
    };

    return this.metodoPagamentoApiService.create(req).pipe(
      map((res: ResponseObject<MetodoPagamentoDTO>) => {
        if (!res.returnCode) {
          throw new Error('Creazione metodo di pagamento fallita: ' + res.msg);
        }
        return res.dati.id;
      }),
      catchError((err) => {
        this.snack.open(
          'Errore nella creazione del metodo di pagamento.',
          'Chiudi',
          { duration: 5000 }
        );
        console.error(
          '[Checkout] Errore nella creazione del metodo di pagamento:',
          err
        );
        return throwError(() => err);
      })
    );
  }

  private extractPaymentToken(metodoValue: string): string {
    if (metodoValue === this.PAYMENT_METHOD_CARD_ID)
      return String(this.pagamentoForm.get('card')!.value || '');
    if (metodoValue === this.PAYMENT_METHOD_PAYPAL_ID)
      return String(this.pagamentoForm.get('email')!.value || '');
    return '';
  }

  private executePayment(
    metodoId: number,
    ordineId: number
  ): Observable<PagamentoDTO> {
    const body: PagamentoReq = {
      ordineId,
      metodoPagamentoId: metodoId,
      totale: this.carrello.totale,
    };
    return this.pagamentoApiService.create(body).pipe(
      map((res: ResponseObject<PagamentoDTO>) => {
        if (!res.returnCode) throw new Error('Pagamento fallito: ' + res.msg);
        return res.dati;
      }),
      catchError((err) => {
        this.snack.open('Errore durante il pagamento. Riprova.', 'Chiudi', {
          duration: 6000,
        });
        console.error('[Checkout] Errore nel pagamento:', err);
        return throwError(() => err);
      })
    );
  }

  private buildShippingAddress(): IndirizzoReq {
    return {
      via: this.checkoutForm.get('indirizzo')!.value,
      citta: this.checkoutForm.get('citta')!.value,
      cap: this.checkoutForm.get('cap')!.value,
      paese: this.checkoutForm.get('nazione')!.value,
    };
  }

  private createOrder(): Observable<number> {
    const body: OrdineReq = {
      accountId: this.account.id,
      indirizzoSpedizione: this.buildShippingAddress(),
    };
    return this.ordineApiService.createOrder(body).pipe(
      map((res: ResponseObject<OrdineDTO>) => {
        if (!res.returnCode)
          throw new Error("Errore nella creazione dell'ordine: " + res.msg);
        return res.dati.id;
      }),
      catchError((err) => {
        this.snack.open(
          "Si è verificato un errore durante la creazione dell'ordine.",
          'Chiudi',
          { duration: 6000 }
        );
        console.error("[Checkout] Errore nella creazione dell'ordine:", err);
        return throwError(() => err);
      })
    );
  }
}
