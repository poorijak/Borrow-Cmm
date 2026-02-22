import { Test, TestingModule } from '@nestjs/testing';
import { MyBagService } from './my-bag.service';

describe('MyBagService', () => {
  let service: MyBagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyBagService],
    }).compile();

    service = module.get<MyBagService>(MyBagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
