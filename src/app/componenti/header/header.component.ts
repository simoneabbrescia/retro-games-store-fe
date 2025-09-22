import { Component, OnInit } from '@angular/core';
import { PiattaformaApi } from '../../api/piattaforma-api.service';
import { CategoriaApi } from '../../api/categoria-api.service';
import { CarrelloApi } from '../../api/carrello-api.service';
import { AuthService } from '../../auth/auth.service';

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
    private piattaformaApi: PiattaformaApi,
    private categoriaApi: CategoriaApi,
    private carrelloApi: CarrelloApi,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPiattaforme();
    this.loadCategorie();
    this.loadCarrello();
  }

  private loadPiattaforme() {
    this.piattaformaApi.getAll().subscribe((response: any) => {
      if (response.returnCode) {
        this.piattaforme = response.dati;
      }
    });
  }

  private loadCategorie() {
    this.categoriaApi.getAll().subscribe((response: any) => {
      if (response.returnCode) {
        this.categorie = response.dati;
      }
    });
  }

  public loadCarrello() {
    if (this.authService.isLoggedIn()) {
      this.carrelloApi
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
}
