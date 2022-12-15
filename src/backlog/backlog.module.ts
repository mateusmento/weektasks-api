import { Module } from '@nestjs/common';
import { EpicsModule } from 'src/epics/epics.module';
import { IssuesModule } from 'src/issues/issues.module';
import { BacklogController } from './backlog.controller';
import { BacklogService } from './backlog.service';

@Module({
  imports: [IssuesModule, EpicsModule],
  controllers: [BacklogController],
  providers: [BacklogService],
})
export class BacklogModule {}
