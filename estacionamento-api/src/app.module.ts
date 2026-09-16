import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClienteModule } from './cliente/cliente.module';
import { VeiculoModule } from './veiculo/veiculo.module';
import { VagaModule } from './vaga/vaga.module';
import { BilheteModule } from './bilhete/bilhete.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClienteModule,
    VeiculoModule,
    VagaModule,
    BilheteModule,
  ],
})
export class AppModule {}