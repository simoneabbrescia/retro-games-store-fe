import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseObject } from '@core/types';
import { CarrelloApiService, CarrelloDTO } from '@features/carrello';
import { CarrelloRigaApiService } from '@features/carrello-riga';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-carrello',
  standalone: false,
  templateUrl: './carrello.component.html',
  styleUrl: './carrello.component.css',
})
export class CarrelloComponent implements OnInit {
  public carrello: any = {};

  constructor(
    private carrelloApiService: CarrelloApiService,
    private authService: AuthService,
    public router: Router,
    private carrelloRigaApiService: CarrelloRigaApiService
  ) {}

  ngOnInit(): void {
    this.loadCarrello();
  }

  private loadCarrello() {
    this.carrelloApiService
      .getCarrelloByAccountId(this.authService.getAccountId())
      .subscribe({
        next: (response: ResponseObject<CarrelloDTO>) => {
          if (response.returnCode) {
            this.carrello = response.dati;
          } else {
            console.error('Errore nel caricamento del carrello:', response.msg);
          }
        },
        error: (err: ResponseObject<CarrelloDTO>) => {
          console.error('Errore durante il caricamento del carrello:', err);
        },
      });
  }

  removeFromCart(rigaId: number) {
    const body = {
      id: rigaId,
    };
    this.carrelloRigaApiService.removeProductFromCart(body).subscribe({
      next: (response: any) => {
        if (response.returnCode) {
          this.loadCarrello();
        } else {
          console.error(
            'Errore durante la rimozione dal carrello:',
            response.msg
          );
        }
      },
      error: (error: any) => {
        console.error('Errore durante la rimozione dal carrello:', error);
      },
    });
  }

  addToCart(productId: number) {
    const body = {
      carrelloId: this.carrello.id,
      prodottoId: productId,
      quantita: 1,
    };
    this.carrelloRigaApiService.addProductToCart(body).subscribe({
      next: (response: any) => {
        if (response.returnCode) {
          this.loadCarrello();
        } else {
          console.error("Errore durante l'aggiunta al carrello:", response.msg);
        }
      },
      error: (error: any) => {
        console.error("Errore durante l'aggiunta al carrello:", error);
      },
    });
  }

  decreaseFromCart(quantitaDisponibile: number, rigaId: number) {
    if (quantitaDisponibile === 1) this.removeFromCart(rigaId);
    else {
      const body = {
        id: rigaId,
        quantita: quantitaDisponibile - 1,
      };
      this.carrelloRigaApiService.updateRow(body).subscribe({
        next: (response: any) => {
          if (response.returnCode) {
            this.loadCarrello();
          } else {
            console.error(
              "Errore durante l'aggiornamento della riga:",
              response.msg
            );
          }
        },
        error: (error: any) => {
          console.error("Errore durante l'aggiornamento della riga:", error);
        },
      });
    }
  }
}
