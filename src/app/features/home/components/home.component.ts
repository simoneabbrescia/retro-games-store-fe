import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeaderComponent } from '@core/layout';
import { ConfirmDialogComponent } from '@core/layout/confirm-dialog/confirm-dialog.component';
import { AuthService } from '@core/services';
import { ResponseBase, ResponseList } from '@core/types';
import { CarrelloRigaApiService } from '@features/carrello-riga';
import { ProdottoApiService, ProdottoDTO } from '@features/prodotto';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  prodotti: ProdottoDTO[] = [];
  idPiattaformaSelezionata!: number;

  private _snackBar = inject(MatSnackBar);

  @ViewChild(HeaderComponent)
  headerComponent!: HeaderComponent;

  constructor(
    private prodottoApiService: ProdottoApiService,
    private authService: AuthService,
    private router: Router,
    private carrelloRigaApiService: CarrelloRigaApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProdotti();
  }

  private loadProdotti() {
    this.prodottoApiService
      .listActive()
      .subscribe((response: ResponseList<ProdottoDTO>) => {
        if (response.returnCode) {
          this.prodotti = response.dati;
        }
      });
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
        message: 'Devi effettuare il login per aggiungere prodotti al carrello. Vuoi accedere ora?',
        confirmText: 'Accedi',
        cancelText: 'Annulla',
        icon: 'login'
      }
    });
    dialogRef.afterClosed().subscribe((goLogin: boolean) => {
      if (goLogin) {
        this.router.navigate(['/accedi']);
      }
    });
  }
}
