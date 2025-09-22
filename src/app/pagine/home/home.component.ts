import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProdottoApi } from '../../api/prodotto-api.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  prodotti: any[] = [];

  constructor(private prodottoApi: ProdottoApi) {}

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
    /* TODO: Implementare la logica per aggiungere il prodotto al carrello.
      Se l'account non è loggato, mostrare un messaggio di errore o reindirizzare alla pagina di login
      altrimenti recupera il carrello dell'utente e aggiungi il prodotto.
    */
  }

}
