import { Test, TestingModule } from '@nestjs/testing';
import { BacklogItemsService } from './backlog-items.service';

describe('BacklogItemsService', () => {
  let service: BacklogItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BacklogItemsService],
    }).compile();

    service = module.get<BacklogItemsService>(BacklogItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
