import { Component, OnInit } from '@angular/core';
import { CarrelloApi } from '../../api/carrello-api.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CarrelloRigaApi } from '../../api/carrello-riga-api.service';

@Component({
  selector: 'app-carrello',
  standalone: false,
  templateUrl: './carrello.component.html',
  styleUrl: './carrello.component.css',
})
export class CarrelloComponent implements OnInit {
  public carrello: any = {};

  constructor(
    private carrelloApi: CarrelloApi,
    private authService: AuthService,
    public router: Router,
    private carrelloRigaApi: CarrelloRigaApi
  ) {}

  ngOnInit(): void {
    this.loadCarrello();
  }

  private loadCarrello() {
    this.carrelloApi
      .getCarrelloByAccountId(this.authService.getAccountId())
      .subscribe(
        (response: any) => {
          if (response.returnCode) {
            this.carrello = response.dati;
          } else
            console.error('Errore nel caricamento del carrello:', response.msg);
        },
        (error: any) => {
          console.error('Errore durante il caricamento del carrello:', error);
        }
      );
  }

  removeFromCart(rigaId: number) {
    const body = {
      id: rigaId,
    };
    this.carrelloRigaApi.removeProductFromCart(body).subscribe({
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
    this.carrelloRigaApi.addProductToCart(body).subscribe({
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
      this.carrelloRigaApi.updateRiga(body).subscribe({
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
