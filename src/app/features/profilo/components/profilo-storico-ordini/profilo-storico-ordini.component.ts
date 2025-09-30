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
      .listByAccount(this.accountService.getAccountId())
      .subscribe({
        next: (res: ResponseList<OrdineDTO>) => {
          this.ordini = res.dati;
        },
        error: (err: any) => {
          console.error('Error loading orders:', err);
        },
      });
  }
}
