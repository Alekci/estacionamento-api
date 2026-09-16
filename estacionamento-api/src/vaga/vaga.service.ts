import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';

@Injectable()
export class VagaService {
  constructor(private prisma: PrismaService) {}

  async create(createVagaDto: CreateVagaDto) {
    const existente = await this.prisma.vaga.findFirst({
      where: { numero_vaga: createVagaDto.numero_vaga },
    });
    if (existente) {
      throw new ConflictException(
        `Já existe uma vaga com o número ${createVagaDto.numero_vaga}`,
      );
    }
    return this.prisma.vaga.create({ data: createVagaDto });
  }

  findAll() {
    return this.prisma.vaga.findMany({
      orderBy: { numero_vaga: 'asc' },
    });
  }

  async findOne(id: number) {
    const vaga = await this.prisma.vaga.findUnique({
      where: { id_vaga: id },
      include: {
        // ✨ CORRIGIDO: "bilhete" no singular
        bilhete: {
          where: { status_bilhete: 'Ocupado' },
        },
      },
    });

    if (!vaga) {
      throw new NotFoundException(`Vaga com ID ${id} não encontrada`);
    }
    return vaga;
  }

  async update(id: number, updateVagaDto: UpdateVagaDto) {
    await this.findOne(id);

    if (updateVagaDto.numero_vaga) {
      const existente = await this.prisma.vaga.findFirst({
        where: {
          numero_vaga: updateVagaDto.numero_vaga,
          NOT: { id_vaga: id },
        },
      });
      if (existente) {
        throw new ConflictException(
          `Já existe outra vaga com o número ${updateVagaDto.numero_vaga}`,
        );
      }
    }

    return this.prisma.vaga.update({
      where: { id_vaga: id },
      data: updateVagaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const ocupada = await this.prisma.bilhete.findFirst({
      where: { Vaga_id_vaga: id, status_bilhete: 'Ocupado' },
    });
    if (ocupada) {
      throw new ConflictException(
        `Vaga está ocupada pelo bilhete #${ocupada.id_bilhete}. Finalize antes de deletar.`,
      );
    }

    return this.prisma.vaga.delete({ where: { id_vaga: id } });
  }

  // ✨ CORRIGIDO: "bilhete" no singular
  findDisponiveis() {
    return this.prisma.vaga.findMany({
      where: {
        bilhete: {
          none: { status_bilhete: 'Ocupado' },
        },
      },
      orderBy: { numero_vaga: 'asc' },
    });
  }
}