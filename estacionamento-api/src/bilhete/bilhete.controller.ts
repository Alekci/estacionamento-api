import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BilheteService } from './bilhete.service';
import { CreateBilheteDto } from './dto/create-bilhete.dto';
import { UpdateBilheteDto } from './dto/update-bilhete.dto';
import { FinalizarBilheteDto } from './dto/finalizar-bilhete.dto';

@Controller('bilhete')
export class BilheteController {
  constructor(private readonly bilheteService: BilheteService) {}

  // ✨ CHECK-IN
  @Post()
  create(@Body() createBilheteDto: CreateBilheteDto) {
    return this.bilheteService.create(createBilheteDto);
  }

  @Get()
  findAll() {
    return this.bilheteService.findAll();
  }

  // Rotas estáticas SEMPRE antes de :id
  @Get('abertos')
  findAbertos() {
    return this.bilheteService.findAbertos();
  }

  @Get('finalizados')
  findFinalizados() {
    return this.bilheteService.findFinalizados();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bilheteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBilheteDto: UpdateBilheteDto,
  ) {
    return this.bilheteService.update(id, updateBilheteDto);
  }

  // ✨ CHECK-OUT
  @Patch(':id/finalizar')
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() finalizarBilheteDto: FinalizarBilheteDto,
  ) {
    return this.bilheteService.finalizar(id, finalizarBilheteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bilheteService.remove(id);
  }
}