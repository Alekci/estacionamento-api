import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBilheteDto } from './dto/create-bilhete.dto';
import { UpdateBilheteDto } from './dto/update-bilhete.dto';
import { FinalizarBilheteDto } from './dto/finalizar-bilhete.dto';

// 💰 Regras de cobrança
const VALOR_PRIMEIRA_HORA = 8.0;
const VALOR_HORA_ADICIONAL = 8.0;
const STATUS_OCUPADO = 'Ocupado';
const STATUS_FINALIZADO = 'Finalizado';

@Injectable()
export class BilheteService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────
  // ABERTURA DE BILHETE (check-in)
  // ─────────────────────────────────────────────
  async create(createBilheteDto: CreateBilheteDto) {
    const { Veiculo_id_veiculo, Vaga_id_vaga } = createBilheteDto;

    // 1. Valida se veículo existe
    const veiculo = await this.prisma.veiculo.findUnique({
      where: { id_veiculo: Veiculo_id_veiculo },
    });
    if (!veiculo) {
      throw new NotFoundException(
        `Veículo com ID ${Veiculo_id_veiculo} não encontrado`,
      );
    }

    // 2. Valida se vaga existe
    const vaga = await this.prisma.vaga.findUnique({
      where: { id_vaga: Vaga_id_vaga },
    });
    if (!vaga) {
      throw new NotFoundException(`Vaga com ID ${Vaga_id_vaga} não encontrada`);
    }

    // 3. Impede vaga já ocupada
    const vagaOcupada = await this.prisma.bilhete.findFirst({
      where: {
        Vaga_id_vaga,
        status_bilhete: STATUS_OCUPADO,
      },
    });
    if (vagaOcupada) {
      throw new ConflictException(
        `Vaga ${vaga.numero_vaga} já está ocupada pelo bilhete #${vagaOcupada.id_bilhete}`,
      );
    }

    // 4. Impede veículo já com bilhete aberto
    const veiculoOcupado = await this.prisma.bilhete.findFirst({
      where: {
        Veiculo_id_veiculo,
        status_bilhete: STATUS_OCUPADO,
      },
    });
    if (veiculoOcupado) {
      throw new ConflictException(
        `Veículo já possui bilhete aberto (#${veiculoOcupado.id_bilhete})`,
      );
    }

    // 5. Cria o bilhete com hora atual
    return this.prisma.bilhete.create({
      data: {
        hora_entrada_bilhete: new Date(),
        status_bilhete: STATUS_OCUPADO,
        Veiculo_id_veiculo,
        Vaga_id_vaga,
      },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
    });
  }

  // ─────────────────────────────────────────────
  // LISTAGENS
  // ─────────────────────────────────────────────
  findAll() {
    return this.prisma.bilhete.findMany({
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
      orderBy: { id_bilhete: 'desc' },
    });
  }

  async findOne(id: number) {
    const bilhete = await this.prisma.bilhete.findUnique({
      where: { id_bilhete: id },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
    });

    if (!bilhete) {
      throw new NotFoundException(`Bilhete #${id} não encontrado`);
    }
    return bilhete;
  }

  // Bilhetes com status "Ocupado"
  findAbertos() {
    return this.prisma.bilhete.findMany({
      where: { status_bilhete: STATUS_OCUPADO },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
      orderBy: { hora_entrada_bilhete: 'asc' },
    });
  }

  // Histórico finalizado
  findFinalizados() {
    return this.prisma.bilhete.findMany({
      where: { status_bilhete: STATUS_FINALIZADO },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
      orderBy: { hora_saida_bilhete: 'desc' },
    });
  }

  // ─────────────────────────────────────────────
  // UPDATE (troca de vaga apenas)
  // ─────────────────────────────────────────────
  async update(id: number, updateBilheteDto: UpdateBilheteDto) {
    const bilhete = await this.findOne(id);

    if (bilhete.status_bilhete !== STATUS_OCUPADO) {
      throw new BadRequestException(
        'Só é possível alterar bilhetes com status "Ocupado"',
      );
    }

    if (updateBilheteDto.Vaga_id_vaga) {
      const vagaOcupada = await this.prisma.bilhete.findFirst({
        where: {
          Vaga_id_vaga: updateBilheteDto.Vaga_id_vaga,
          status_bilhete: STATUS_OCUPADO,
        },
      });
      if (vagaOcupada && vagaOcupada.id_bilhete !== id) {
        throw new ConflictException('Vaga destino já está ocupada');
      }
    }

    return this.prisma.bilhete.update({
      where: { id_bilhete: id },
      data: updateBilheteDto,
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
    });
  }

  // ─────────────────────────────────────────────
  // FINALIZAR (check-out + cálculo do valor)
  // ─────────────────────────────────────────────
  async finalizar(id: number, dto: FinalizarBilheteDto = {}) {
    const bilhete = await this.findOne(id);

    if (bilhete.status_bilhete !== STATUS_OCUPADO) {
      throw new BadRequestException('Bilhete já foi finalizado');
    }

    const horaSaida = new Date();
    const valorCalculado = this.calcularValor(
      bilhete.hora_entrada_bilhete,
      horaSaida,
    );

    return this.prisma.bilhete.update({
      where: { id_bilhete: id },
      data: {
        hora_saida_bilhete: horaSaida,
        valor_bilhete: dto.valor_bilhete ?? valorCalculado,
        status_bilhete: STATUS_FINALIZADO,
      },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
    });
  }

  // ─────────────────────────────────────────────
  // REMOVER (apenas finalizados, para não perder histórico)
  // ─────────────────────────────────────────────
  async remove(id: number) {
    const bilhete = await this.findOne(id);

    if (bilhete.status_bilhete === STATUS_OCUPADO) {
      throw new BadRequestException(
        'Não é possível deletar bilhete em aberto. Finalize primeiro.',
      );
    }

    return this.prisma.bilhete.delete({ where: { id_bilhete: id } });
  }

  // ─────────────────────────────────────────────
  // REGRA DE COBRANÇA
  // ─────────────────────────────────────────────
  private calcularValor(entrada: Date, saida: Date): number {
    const ms = saida.getTime() - entrada.getTime();
    const horas = Math.ceil(ms / (1000 * 60 * 60)); // arredonda pra cima

    if (horas <= 1) return VALOR_PRIMEIRA_HORA;
    return VALOR_PRIMEIRA_HORA + (horas - 1) * VALOR_HORA_ADICIONAL;
  }
}