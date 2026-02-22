import { Test, TestingModule } from '@nestjs/testing';
import { MyBagController } from './my-bag.controller';
import { MyBagService } from './my-bag.service';

describe('MyBagController', () => {
  let controller: MyBagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyBagController],
      providers: [MyBagService],
    }).compile();

    controller = module.get<MyBagController>(MyBagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
