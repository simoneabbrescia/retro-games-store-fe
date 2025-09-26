import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HeaderComponent } from '@core/layout/header/header.component';
import { CarrelloRigaApiService } from '../../../api/carrello-riga-api.service';
import { ProdottoApiService } from '../../../api/prodotto-api.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  prodotti: any[] = [];

  private _snackBar = inject(MatSnackBar);

  @ViewChild(HeaderComponent)
  headerComponent!: HeaderComponent;

  constructor(
    private prodottoApiService: ProdottoApiService,
    private authService: AuthService,
    private router: Router,
    private carrelloRigaApiService: CarrelloRigaApiService
  ) {}

  ngOnInit() {
    this.loadProdotti();
  }

  private loadProdotti() {
    this.prodottoApiService.getAll().subscribe((response: any) => {
      if (response.returnCode) {
        this.prodotti = response.dati;
      }
    });
  }

  public onProductSelectPlatformChange(prodotto: any, event: any) {
    prodotto.idPiattaformaSelezionata = event.target.value;
  }

  public addToCart(prodotto: any) {
    if (!this.authService.isLogged()) {
      alert('Devi effettuare il login per aggiungere prodotti al carrello.');
      this.router.navigate(['/accedi']);
      return;
    }
    const body = {
      carrelloId: this.headerComponent.carrello.id,
      prodottoId: prodotto.id,
      quantita: 1,
    };
    this.carrelloRigaApiService.addProductToCart(body).subscribe({
      next: (response: any) => {
        if (!response.returnCode) {
          console.error(
            "Errore nell'aggiunta del prodotto al carrello:",
            response.msg
          );
          return;
        }
        this.headerComponent.loadCarrello();
        this._snackBar.open(
          'Prodotto aggiunto al carrello con successo!',
          'Ok',
          { duration: 5000, panelClass: ['snackbar-success'] }
        );
      },
      error: (error: any) => {
        console.error("Errore nell'aggiunta del prodotto al carrello:", error);
      },
    });
  }
}
