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
import { VagaService } from './vaga.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';

@Controller('vaga')
export class VagaController {
  constructor(private readonly vagaService: VagaService) {}

  @Post()
  create(@Body() createVagaDto: CreateVagaDto) {
    return this.vagaService.create(createVagaDto);
  }

  @Get()
  findAll() {
    return this.vagaService.findAll();
  }

  // ✨ ATENÇÃO: rota estática SEMPRE antes da rota com :id
  @Get('disponiveis')
  findDisponiveis() {
    return this.vagaService.findDisponiveis();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vagaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVagaDto: UpdateVagaDto,
  ) {
    return this.vagaService.update(id, updateVagaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vagaService.remove(id);
  }
}