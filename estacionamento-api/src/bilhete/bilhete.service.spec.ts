import { Test, TestingModule } from '@nestjs/testing';
import { BilheteService } from './bilhete.service';

describe('BilheteService', () => {
  let service: BilheteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BilheteService],
    }).compile();

    service = module.get<BilheteService>(BilheteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
