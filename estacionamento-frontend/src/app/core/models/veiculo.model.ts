import { Cliente } from './cliente.model';

export interface Veiculo {
  id_veiculo: number;
  placa_veiculo: string;
  marca_modelo_veiculo?: string;
  cor_veiculo?: string;
  Cliente_id_cliente: number;
  cliente?: Cliente;
}

export interface CreateVeiculoDto {
  placa_veiculo: string;
  marca_modelo_veiculo?: string;
  cor_veiculo?: string;
  Cliente_id_cliente: number;
}

export type UpdateVeiculoDto = Partial<CreateVeiculoDto>;