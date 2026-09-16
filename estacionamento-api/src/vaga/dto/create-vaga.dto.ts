export enum TipoVaga {
  PCD = 'PCD',
  COMUM = 'Vaga Comum',
}

export class CreateVagaDto {
  numero_vaga: number;
  tipo_vaga: TipoVaga;
}