import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services';
import { ResponseBase, ResponseList, ResponseObject } from '@core/types';
import { AccountService } from '@features/account';
import { CarrelloApiService, CarrelloDTO } from '@features/carrello';
import { CarrelloRigaApiService } from '@features/carrello-riga';
import { CategoriaApiService, CategoriaDTO } from '@features/categoria';
import { PiattaformaApiService, PiattaformaDTO } from '@features/piattaforma';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  piattaforme: PiattaformaDTO[] = [];
  categorie: CategoriaDTO[] = [];
  carrello: CarrelloDTO = {
    id: 0,
    accountId: 0,
    righe: [],
    totaleQuantita: 0,
    totale: 0,
  };

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private piattaformaApiService: PiattaformaApiService,
    private categoriaApiService: CategoriaApiService,
    private carrelloApiService: CarrelloApiService,
    private carrelloRigaApiService: CarrelloRigaApiService
  ) {}

  ngOnInit() {
    this.loadPiattaforme();
    this.loadCategorie();
    this.loadCarrello();
  }

  public isLoggedIn(): boolean {
    return this.authService.isLogged;
  }

  private loadPiattaforme() {
    this.piattaformaApiService
      .listActive()
      .subscribe((response: ResponseList<PiattaformaDTO>) => {
        if (response.returnCode) {
          this.piattaforme = response.dati;
        }
      });
  }

  private loadCategorie() {
    this.categoriaApiService
      .listActive()
      .subscribe((response: ResponseList<CategoriaDTO>) => {
        if (response.returnCode) {
          this.categorie = response.dati;
        }
      });
  }

  public loadCarrello() {
    if (this.authService.isLogged) {
      this.carrelloApiService
        .getCarrelloByAccountId(this.accountService.getAccountId())
        .subscribe((response: ResponseObject<CarrelloDTO>) => {
          if (response.returnCode) {
            this.carrello = response.dati;
          } else {
            console.error('Errore nel recupero del carrello:', response.msg);
          }
        });
    }
  }

  public rimuoviDalCarrello(rigaId: number) {
    this.carrelloRigaApiService
      .removeProductFromCart({ id: rigaId })
      .subscribe({
        next: (response: ResponseBase) => {
          if (response.returnCode) {
            this.loadCarrello();
          } else {
            console.error(
              'Errore nella rimozione del prodotto dal carrello:',
              response.msg
            );
          }
        },
        error: (error: ResponseBase) => {
          console.error(
            'Errore nella rimozione del prodotto dal carrello:',
            error
          );
        },
      });
  }
}
