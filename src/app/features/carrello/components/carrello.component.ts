import { Component, OnInit } from '@angular/core';
import {
  CarrelloDTO,
  CarrelloService,
  createEmptyCarrello,
} from '@features/carrello';
import { CarrelloRigaApiService } from '@features/carrello-riga';

@Component({
  selector: 'app-carrello',
  standalone: false,
  templateUrl: './carrello.component.html',
  styleUrl: './carrello.component.css',
})
export class CarrelloComponent implements OnInit {
  public carrello: CarrelloDTO = createEmptyCarrello();

  constructor(
    private carrelloService: CarrelloService,
    private carrelloRigaApiService: CarrelloRigaApiService
  ) {}

  ngOnInit(): void {
    this.refreshCarrello();
  }

  private refreshCarrello(): void {
    this.carrelloService.loadCarrello((c) => {
      this.carrello = c;
    });
  }

  removeFromCart(rigaId: number) {
    const body = {
      id: rigaId,
    };
    this.carrelloRigaApiService.removeProductFromCart(body).subscribe({
      next: (response: any) => {
        if (response.returnCode) {
          this.refreshCarrello();
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
          this.refreshCarrello();
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
    if (quantitaDisponibile === 1) {
      this.removeFromCart(rigaId);
    } else {
      const body = {
        id: rigaId,
        quantita: quantitaDisponibile - 1,
      };
      this.carrelloRigaApiService.updateRow(body).subscribe({
        next: (response: any) => {
          if (response.returnCode) {
            this.refreshCarrello();
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
