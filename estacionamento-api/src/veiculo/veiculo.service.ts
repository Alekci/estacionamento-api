import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';

@Injectable()
export class VeiculoService {
  constructor(private prisma: PrismaService) {}

  async create(createVeiculoDto: CreateVeiculoDto) {
    return this.prisma.veiculo.create({
      data: createVeiculoDto,
      include: { cliente: true }, // traz os dados do proprietário junto
    });
  }

  findAll() {
    return this.prisma.veiculo.findMany({
      include: { cliente: true },
      orderBy: { id_veiculo: 'asc' },
    });
  }

  async findOne(id: number) {
    const veiculo = await this.prisma.veiculo.findUnique({
      where: { id_veiculo: id },
      include: {
        cliente: true,
        bilhetes: true, // traz o histórico de bilhetes do veículo
      },
    });

    if (!veiculo) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
    return veiculo;
  }

  async update(id: number, updateVeiculoDto: UpdateVeiculoDto) {
    await this.findOne(id); // valida se existe antes de atualizar
    return this.prisma.veiculo.update({
      where: { id_veiculo: id },
      data: updateVeiculoDto,
      include: { cliente: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // valida se existe antes de deletar
    return this.prisma.veiculo.delete({
      where: { id_veiculo: id },
    });
  }
}