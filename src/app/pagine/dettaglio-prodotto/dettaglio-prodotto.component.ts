import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrelloRigaApiService } from '../../api/carrello-riga-api.service';
import { ProdottoApiService } from '../../api/prodotto-api.service';
import { AuthService } from '../../auth/auth.service';
import { HeaderComponent } from '../../core/layout/header/header.component';

@Component({
  selector: 'app-dettaglio-prodotto',
  standalone: false,
  templateUrl: './dettaglio-prodotto.component.html',
  styleUrl: './dettaglio-prodotto.component.css',
})
export class DettaglioProdottoComponent implements OnInit {
  prodotto: any;
  private _snackBar = inject(MatSnackBar);

  @ViewChild(HeaderComponent)
  headerComponent!: HeaderComponent;

  constructor(
    private route: ActivatedRoute,
    private prodottoApiService: ProdottoApiService,
    private title: Title,
    private authService: AuthService,
    private router: Router,
    private carrelloRigaApiService: CarrelloRigaApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const prodottoId = +params['id'];
      this.loadProdotto(prodottoId);
    });
  }

  private loadProdotto(prodottoId: number) {
    this.prodottoApiService.getById(prodottoId).subscribe({
      next: (response: any) => {
        if (!response.returnCode) {
          console.error('Errore nel recupero del prodotto:', response.msg);
          return;
        }
        this.prodotto = response.dati;
        this.title.setTitle(this.prodotto.nome);
      },
      error: (error: any) => {
        console.error('Errore nel recupero del prodotto:', error);
      },
    });
  }

  public addToCart() {
    if (!this.authService.isLogged()) {
      alert('Devi effettuare il login per aggiungere prodotti al carrello.');
      this.router.navigate(['/accedi']);
      return;
    }
    const body = {
      carrelloId: this.headerComponent.carrello.id,
      prodottoId: this.prodotto.id,
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

  public goBack() {
    this.router.navigate(['/']);
  }

  public onProductSelectPlatformChange(selectedId: any) {
    this.prodotto.idPiattaformaSelezionata = selectedId;
  }
}
