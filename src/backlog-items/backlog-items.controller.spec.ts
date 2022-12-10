import { Test, TestingModule } from '@nestjs/testing';
import { BacklogItemsController } from './backlog-items.controller';
import { BacklogItemsService } from './backlog-items.service';

describe('BacklogItemsController', () => {
  let controller: BacklogItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BacklogItemsController],
      providers: [BacklogItemsService],
    }).compile();

    controller = module.get<BacklogItemsController>(BacklogItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
