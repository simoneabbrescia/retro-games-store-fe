import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrelloApi } from '../../api/carrello-api.service';
import { AuthService } from '../../auth/auth.service';
import { TipoMetodoPagamentoApi } from '../../api/tipo-metodo-pagamento-api.service';
import { OrdineApiService } from '../../api/ordine-api.service';

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
    private carrelloApi: CarrelloApi,
    private authService: AuthService,
    private tipoMetodoPagamentoApi: TipoMetodoPagamentoApi,
    private fb: FormBuilder,
    private ordineApi: OrdineApiService
  ) {}

  ngOnInit() {
    this.loadAddressForm();
    this.loadPaymentForm();
    this.loadPaymentMethods();
    this.loadCarrello();
  }

  private loadCarrello() {
    this.carrelloApi
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
  }

  private loadPaymentMethods() {
    this.tipoMetodoPagamentoApi.getAll().subscribe({
      next: (response: any) => {
        if (response.returnCode) {
          this.metodiPagamento = response.dati;
          if (this.metodiPagamento.length > 0) {
            this.pagamentoForm.get('metodo')?.setValue(this.metodiPagamento[0].id);
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
    const metodo = this.pagamentoForm.get('metodo')?.value;
    const card = this.pagamentoForm.get('card')?.value;
    const email = this.pagamentoForm.get('email')?.value;
    const terms = this.pagamentoForm.get('terms')?.value;
    if (!terms) return true;
    if (metodo === 1 && card) return false;
    if (metodo === 2 && email) return false;
    if (metodo === 3) return false;
    return true;
  }

  public onAddressStepContinue() {
    this.ordineApi.createOrder({
      accountId: this.authService.getAccountId(),
      carrelloId: this.carrello.id,
    }).subscribe({
      next: (response: any) => {
        if (response.returnCode) {
          this.ordineId = response.dati.id;
          console.log('Ordine creato con successo:', this.ordineId);
        } else {
          console.error('Errore nella creazione dell\'ordine:', response.msg);
        }
      },
      error: (err: any) => {
        console.error('Errore nella creazione dell\'ordine:', err);
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
        
      }
    }
  }
}
