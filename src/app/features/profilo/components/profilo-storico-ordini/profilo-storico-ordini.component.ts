import { Component, OnInit } from '@angular/core';
import { ResponseList } from '@core/types';
import { AccountService } from '@features/account';
import { OrdineApiService } from '@features/ordine';
import { OrdineDTO } from '@features/ordine/data-access/dtos/ordine-response.dto';

@Component({
  selector: 'app-profilo-storico-ordini',
  standalone: false,
  templateUrl: './profilo-storico-ordini.component.html',
  styleUrl: './profilo-storico-ordini.component.css',
})
export class ProfiloStoricoOrdiniComponent implements OnInit {
  public ordini!: OrdineDTO[];

  constructor(
    private ordineApiService: OrdineApiService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadOrdini();
  }

  private loadOrdini(): void {
    this.ordineApiService
      .getAllByAccountId(this.accountService.getAccountId())
      .subscribe({
        next: (response: ResponseList<OrdineDTO>) => {
          this.ordini = response.dati;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
        },
      });
  }
}
