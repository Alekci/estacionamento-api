export interface Cliente {
  id_cliente: number;
  nome_cliente: string;
  cpf_cliente: string;
  telefone_cliente: string;
  endereco_cliente: string;
}

export interface CreateClienteDto {
  nome_cliente: string;
  cpf_cliente: string;
  telefone_cliente: string;
  endereco_cliente: string;
}

export type UpdateClienteDto = Partial<CreateClienteDto>;