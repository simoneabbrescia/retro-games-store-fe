import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrelloApiService } from '@features/carrello';
import { OrdineApiService } from '../../api/ordine-api.service';
import { TipoMetodoPagamentoApiService } from '../../api/tipo-metodo-pagamento-api.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  carrello: any = {};
  account: any = {};
  metodiPagamento: any[] = [];
  checkoutForm!: FormGroup; // indirizzo
  pagamentoForm!: FormGroup; // pagamento
  ordineId: number | undefined;

  constructor(
    private carrelloApiService: CarrelloApiService,
    private authService: AuthService,
    private tipoMetodoPagamentoApiService: TipoMetodoPagamentoApiService,
    private fb: FormBuilder,
    private ordineApiService: OrdineApiService
  ) {}

  ngOnInit() {
    this.loadAddressForm();
    this.loadPaymentForm();
    this.loadPaymentMethods();
    this.loadCarrello();
  }

  private loadCarrello() {
    this.carrelloApiService
      .getCarrelloByAccountId(this.authService.getAccountId())
      .subscribe({
        next: (response: any) => {
          if (response.returnCode) {
            this.carrello = response.dati;
          } else {
            console.error('Errore nel recupero del carrello:', response.msg);
          }
        },
        error: (err: any) => {
          console.error('Errore nel recupero del carrello:', err);
        },
      });
  }

  private loadAddressForm() {
    this.checkoutForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      indirizzo: ['', [Validators.required, Validators.minLength(5)]],
      citta: ['', [Validators.required, Validators.minLength(2)]],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      nazione: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  private loadPaymentForm() {
    this.pagamentoForm = this.fb.group({
      metodo: [null, Validators.required],
      card: [''],
      email: [''],
      terms: [false, Validators.requiredTrue],
    });

    // Aggiorna i validators in base al metodo scelto
    this.pagamentoForm.get('metodo')?.valueChanges.subscribe((metodo) => {
      this.updatePaymentValidators(metodo);
    });
  }

  private loadPaymentMethods() {
    this.tipoMetodoPagamentoApiService.getAll().subscribe({
      next: (response: any) => {
        if (response.returnCode) {
          this.metodiPagamento = response.dati;
          if (this.metodiPagamento.length > 0) {
            const initialMetodo = this.metodiPagamento[0].id;
            this.pagamentoForm.get('metodo')?.setValue(initialMetodo);
            // Allinea i validators allo stato iniziale
            this.updatePaymentValidators(initialMetodo);
          }
        } else {
          console.error(
            'Errore nel recupero dei metodi di pagamento:',
            response.msg
          );
        }
      },
      error: (err: any) => {
        console.error('Errore nel recupero dei metodi di pagamento:', err);
      },
    });
  }

  public paymentStepInvalid(): boolean {
    // Usa direttamente la validità del form per abilitare/disabilitare il bottone
    return this.pagamentoForm.invalid;
  }

  public onAddressStepContinue() {
    this.ordineApiService
      .createOrder({
        accountId: this.authService.getAccountId(),
        carrelloId: this.carrello.id,
      })
      .subscribe({
        next: (response: any) => {
          if (response.returnCode) {
            this.ordineId = response.dati.id;
            console.log('Ordine creato con successo:', this.ordineId);
          } else {
            console.error("Errore nella creazione dell'ordine:", response.msg);
          }
        },
        error: (err: any) => {
          console.error("Errore nella creazione dell'ordine:", err);
        },
      });
  }

  public placeOrder() {
    if (!this.ordineId) {
      console.error('Ordine non creato. Impossibile procedere.');
      return;
    }
    const body = {
      pagamento: {
        ordineId: this.ordineId,
        metodoPagamentoId: this.pagamentoForm.get('metodo')?.value,
      },
    };
  }

  private updatePaymentValidators(metodo: number | null) {
    const cardCtrl = this.pagamentoForm.get('card');
    const emailCtrl = this.pagamentoForm.get('email');

    if (!cardCtrl || !emailCtrl) return;

    // Pulisce sempre prima
    cardCtrl.clearValidators();
    emailCtrl.clearValidators();

    // Applica validators in base al metodo
    if (metodo === 1) {
      // Carta: richiedi numero carta (13-19 cifre)
      cardCtrl.setValidators([
        Validators.required,
        Validators.pattern(/^\d{13,19}$/),
      ]);
      // Azzera email quando non serve
      emailCtrl.setValue('');
    } else if (metodo === 2) {
      // PayPal: richiedi email valida
      emailCtrl.setValidators([Validators.required, Validators.email]);
      // Azzera card quando non serve
      cardCtrl.setValue('');
    } else if (metodo === 3) {
      // Bonifico: nessun dato aggiuntivo richiesto; pulisci entrambi
      cardCtrl.setValue('');
      emailCtrl.setValue('');
    }

    cardCtrl.updateValueAndValidity({ emitEvent: false });
    emailCtrl.updateValueAndValidity({ emitEvent: false });
  }
}
