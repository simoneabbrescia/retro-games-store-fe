import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { ProdottoApi } from '../../api/prodotto-api.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CarrelloApi } from '../../api/carrello-api.service';
import { CarrelloRigaApi } from '../../api/carrello-riga-api.service';
import { HeaderComponent } from '../../componenti/header/header.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  prodotti: any[] = [];

  @ViewChild(HeaderComponent)
  headerComponent!: HeaderComponent;

  constructor(
    private prodottoApi: ProdottoApi,
    private authService: AuthService,
    private router: Router,
    private carrelloApi: CarrelloApi,
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
    this.carrelloRigaApi.addProductToCart(this.headerComponent.carrello.id, prodotto.id, 1)
      .subscribe({
        next: (response: any) => {
          if (!response.returnCode) {
            console.error("Errore nell'aggiunta del prodotto al carrello:", response.msg);
            return;
          }
          this.headerComponent.loadCarrello();
          alert('Prodotto aggiunto al carrello con successo!');
        },
        error: (error: any) => {
          console.error("Errore nell'aggiunta del prodotto al carrello:", error);
        },
      });
  }
}
