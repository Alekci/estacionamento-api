export enum TipoVaga {
  PCD = 'PCD',
  COMUM = 'Vaga Comum',
}

export interface Vaga {
  id_vaga: number;
  numero_vaga: number;
  tipo_vaga: TipoVaga;
}

export interface CreateVagaDto {
  numero_vaga: number;
  tipo_vaga: TipoVaga;
}

export type UpdateVagaDto = Partial<CreateVagaDto>;