import { Component, OnInit } from '@angular/core';
import { CarrelloApiService } from '@features/carrello';
import { CarrelloRigaApiService } from '../../../api/carrello-riga-api.service';
import { CategoriaApiService } from '../../../api/categoria-api.service';
import { PiattaformaApiService } from '../../../api/piattaforma-api.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  piattaforme: any[] = [];
  categorie: any[] = [];
  rout: string = '';
  carrello: any = {};

  constructor(
    private piattaformaApiService: PiattaformaApiService,
    private categoriaApiService: CategoriaApiService,
    private carrelloApiService: CarrelloApiService,
    private authService: AuthService,
    private carrelloRigaApiService: CarrelloRigaApiService
  ) {}

  ngOnInit() {
    this.loadPiattaforme();
    this.loadCategorie();
    this.loadCarrello();
  }

  public isLoggedIn(): boolean {
    return this.authService.isLogged();
  }

  private loadPiattaforme() {
    this.piattaformaApiService.getAll().subscribe((response: any) => {
      if (response.returnCode) {
        this.piattaforme = response.dati;
      }
    });
  }

  private loadCategorie() {
    this.categoriaApiService.getAll().subscribe((response: any) => {
      if (response.returnCode) {
        this.categorie = response.dati;
      }
    });
  }

  public loadCarrello() {
    if (this.authService.isLogged()) {
      this.carrelloApiService
        .getCarrelloByAccountId(this.authService.getAccountId())
        .subscribe((response: any) => {
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
        next: (response: any) => {
          if (response.returnCode) {
            this.loadCarrello();
          } else {
            console.error(
              'Errore nella rimozione del prodotto dal carrello:',
              response.msg
            );
          }
        },
        error: (error: any) => {
          console.error(
            'Errore nella rimozione del prodotto dal carrello:',
            error
          );
        },
      });
  }
}
