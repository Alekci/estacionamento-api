import { Veiculo } from './veiculo.model';
import { Vaga } from './vaga.model';

export type StatusBilhete = 'Ocupado' | 'Finalizado';

export interface Bilhete {
  id_bilhete: number;
  hora_entrada_bilhete: string;
  hora_saida_bilhete: string | null;
  valor_bilhete: string | null;
  status_bilhete: StatusBilhete;
  Veiculo_id_veiculo: number;
  Vaga_id_vaga: number;
  veiculo?: Veiculo;
  vaga?: Vaga;
}

export interface CreateBilheteDto {
  Veiculo_id_veiculo: number;
  Vaga_id_vaga: number;
}

export interface FinalizarBilheteDto {
  valor_bilhete?: number;
}