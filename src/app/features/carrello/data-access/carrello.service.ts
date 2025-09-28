import { Injectable } from '@angular/core';
import { ResponseObject } from '@core/types';
import { AccountService } from '@features/account';
import { CarrelloApiService } from './carrello-api.service';
import { CarrelloDTO, createEmptyCarrello } from './dtos/carrello-response.dto';

@Injectable({
  providedIn: 'root',
})
export class CarrelloService {
  public carrello: CarrelloDTO = createEmptyCarrello();

  constructor(
    private accountService: AccountService,
    private carrelloApiService: CarrelloApiService
  ) {}

  public loadCarrello(callback?: (carrello: CarrelloDTO) => void): void {
    this.carrelloApiService
      .getCarrelloByAccountId(this.accountService.getAccountId())
      .subscribe({
        next: (response: ResponseObject<CarrelloDTO>) => {
          if (response.returnCode) {
            this.carrello = response.dati;
            if (callback) {
              callback(this.carrello);
            }
          } else {
            console.error('Errore nel recupero del carrello:', response.msg);
          }
        },
        error: (err: ResponseObject<CarrelloDTO>) => {
          console.error('Errore nel recupero del carrello:', err);
        },
      });
  }
}
