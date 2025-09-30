import { Injectable } from '@angular/core';
import { ResponseList } from '@core/types';
import { Observable } from 'rxjs';
import { ProdottoDTO } from './dtos/prodotto-response.dto';
import { ProdottoApiService } from './prodotto-api.service';

@Injectable({ providedIn: 'root' })
export class ProdottoService {
  constructor(private prodottoApiService: ProdottoApiService) {}

  loadProdotti(
    id?: number,
    nome?: string,
    categoriaId?: number,
    piattaformaId?: number
  ): Observable<ResponseList<ProdottoDTO>> {
    return this.prodottoApiService.listByFilter(
      id,
      nome,
      categoriaId,
      piattaformaId
    );
  }
}
