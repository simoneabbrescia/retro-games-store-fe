import { Component, OnInit } from '@angular/core';
import { PiattaformaApi } from '../../api/piattaforma-api.service';
import { CategoriaApi } from '../../api/categoria-api.service';

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

  constructor(
    private piattaformaApi: PiattaformaApi,
    private categoriaApi: CategoriaApi
  ) {}

  ngOnInit() {
    this.loadPiattaforme();
    this.loadCategorie();
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
}
