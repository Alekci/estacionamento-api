import { Module } from '@nestjs/common';
import { BilheteService } from './bilhete.service';
import { BilheteController } from './bilhete.controller';

@Module({
  controllers: [BilheteController],
  providers: [BilheteService],
})
export class BilheteModule {}