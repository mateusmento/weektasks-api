import { Module } from '@nestjs/common';
import { BacklogItemsService } from './backlog-items.service';
import { BacklogItemsController } from './backlog-items.controller';

@Module({
  controllers: [BacklogItemsController],
  providers: [BacklogItemsService]
})
export class BacklogItemsModule {}
