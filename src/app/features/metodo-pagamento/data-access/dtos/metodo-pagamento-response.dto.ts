import { TipoMetodoPagamentoDTO } from '@features/tipo-metodo-pagamento';

export interface MetodoPagamentoDTO {
  id: number;
  accountId: number;
  tipo: TipoMetodoPagamentoDTO;
  token: string;
  metodoDefault: boolean;
  attivo: boolean;
}
