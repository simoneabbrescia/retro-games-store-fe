import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent, HeaderComponent } from '@core/layout';
import { AuthService } from '@core/services';
import { ResponseBase } from '@core/types';
import { CarrelloRigaApiService } from '@features/carrello-riga';
import { ProdottoDTO, ProdottoService } from '@features/prodotto';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  prodotti: ProdottoDTO[] = [];
  idPiattaformaSelezionata!: number;
  searchTerm: string = '';
  categoriaId?: number;
  piattaformaId?: number;

  private _snackBar = inject(MatSnackBar);

  @ViewChild(HeaderComponent)
  headerComponent!: HeaderComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private prodottoService: ProdottoService,
    private carrelloRigaApiService: CarrelloRigaApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Legge i query params iniziali
    this.route.queryParams.subscribe((params) => {
      this.categoriaId = params['c'] ? Number(params['c']) : undefined;
      this.piattaformaId = params['p'] ? Number(params['p']) : undefined;
      this.searchTerm = params['nome'] || '';

      this.caricaProdotti();
    });
  }

  // Funzione centrale per caricare i prodotti filtrati
  caricaProdotti(): void {
    this.prodottoService
      .loadProdotti(
        undefined, // ID prodotto
        this.searchTerm, // Nome prodotto
        this.categoriaId, // ID categoria
        this.piattaformaId // ID piattaforma
      )
      .subscribe((res) => {
        this.prodotti = res.returnCode ? res.dati : [];
      });
  }

  // Evento dall'header: ricerca per nome
  onSearch(term: string): void {
    this.searchTerm = term;

    this.router.navigate([], {
      queryParams: { nome: term || null },
      queryParamsHandling: 'merge',
    });

    this.caricaProdotti();
  }

  // Evento filtri laterali: categoria e piattaforma
  onFiltroCliccato(cId?: number, pId?: number): void {
    this.categoriaId = cId;
    this.piattaformaId = pId;

    this.router.navigate([], {
      queryParams: { c: cId || null, p: pId || null },
      queryParamsHandling: 'merge',
    });

    this.caricaProdotti();
  }

  public onProductSelectPlatformChange(event: any) {
    this.idPiattaformaSelezionata = event.target.value;
  }

  public addToCart(prodotto: ProdottoDTO) {
    if (!this.authService.isLogged) {
      this.askToLogin();
      return;
    }
    const body = {
      carrelloId: this.headerComponent.carrello.id,
      prodottoId: prodotto.id,
      quantita: 1,
    };
    this.carrelloRigaApiService.addProductToCart(body).subscribe({
      next: (response: ResponseBase) => {
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
      error: (error: ResponseBase) => {
        console.error("Errore nell'aggiunta del prodotto al carrello:", error);
      },
    });
  }

  private askToLogin() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Accesso richiesto',
        message:
          'Devi effettuare il login per aggiungere prodotti al carrello. Vuoi accedere ora?',
        confirmText: 'Accedi',
        cancelText: 'Annulla',
        icon: 'login',
      },
    });
    dialogRef.afterClosed().subscribe((goLogin: boolean) => {
      if (goLogin) {
        this.router.navigate(['/accedi']);
      }
    });
  }
}
