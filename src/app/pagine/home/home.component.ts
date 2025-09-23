import {
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProdottoApi } from '../../api/prodotto-api.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CarrelloRigaApi } from '../../api/carrello-riga-api.service';
import { HeaderComponent } from '../../componenti/header/header.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private prodottoApi: ProdottoApi,
    private authService: AuthService,
    private router: Router,
    private carrelloRigaApi: CarrelloRigaApi
  ) {}

  ngOnInit() {
    this.loadProdotti();
  }

  private loadProdotti() {
    this.prodottoApi.getAll().subscribe((response: any) => {
      if (response.returnCode) {
        this.prodotti = response.dati;
      }
    });
  }

  public onProductSelectPlatformChange(prodotto: any, event: any) {
    prodotto.idPiattaformaSelezionata = event.target.value;
  }

  public addToCart(prodotto: any) {
    if (!this.authService.isLoggedIn()) {
      alert('Devi effettuare il login per aggiungere prodotti al carrello.');
      this.router.navigate(['/accedi']);
      return;
    }
    const body = {
      'carrelloId': this.headerComponent.carrello.id,
      'prodottoId': prodotto.id,
      'quantita': 1
    };
    this.carrelloRigaApi.addProductToCart(body)
      .subscribe({
        next: (response: any) => {
          if (!response.returnCode) {
            console.error("Errore nell'aggiunta del prodotto al carrello:", response.msg);
            return;
          }
          this.headerComponent.loadCarrello();
          this._snackBar.open('Prodotto aggiunto al carrello con successo!', 'Ok', { duration: 5000 });
        },
        error: (error: any) => {
          console.error("Errore nell'aggiunta del prodotto al carrello:", error);
        },
      });
  }
}
