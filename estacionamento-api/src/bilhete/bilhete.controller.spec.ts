import { Test, TestingModule } from '@nestjs/testing';
import { BilheteController } from './bilhete.controller';
import { BilheteService } from './bilhete.service';

describe('BilheteController', () => {
  let controller: BilheteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BilheteController],
      providers: [BilheteService],
    }).compile();

    controller = module.get<BilheteController>(BilheteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
