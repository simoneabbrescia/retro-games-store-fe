import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@core/services';
import { ResponseBase, ResponseList, ResponseObject } from '@core/types';
import { AccountService } from '@features/account';
import { CarrelloApiService, CarrelloDTO } from '@features/carrello';
import { CarrelloRigaApiService } from '@features/carrello-riga';
import { CategoriaApiService, CategoriaDTO } from '@features/categoria';
import { PiattaformaApiService, PiattaformaDTO } from '@features/piattaforma';
import { MatMenuTrigger } from '@angular/material/menu';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
    private carrelloRigaApiService: CarrelloRigaApiService,
    private router: Router,
    private dialog: MatDialog
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

  isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  public onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Logout',
        message: "Sei sicuro di voler uscire dall'account?",
        confirmText: 'Esci',
        cancelText: 'Annulla',
        icon: 'logout',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.authService.logout();
        this.router.navigate(['/accedi']);
      }
    });
  }
}
