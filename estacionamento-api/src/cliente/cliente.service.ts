import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  create(createClienteDto: CreateClienteDto) {
    return this.prisma.cliente.create({ data: createClienteDto });
  }

  findAll() {
    return this.prisma.cliente.findMany();
  }

  findOne(id: number) {
    return this.prisma.cliente.findUnique({ where: { id_cliente: id } });
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return this.prisma.cliente.update({
      where: { id_cliente: id },
      data: updateClienteDto,
    });
  }

  remove(id: number) {
    return this.prisma.cliente.delete({ where: { id_cliente: id } });
  }
}