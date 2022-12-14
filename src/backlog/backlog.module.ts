import { Module } from '@nestjs/common';
import { EpicsModule } from 'src/epics/epics.module';
import { IssuesModule } from 'src/issues/issues.module';
import { BacklogController } from './backlog.controller';

@Module({
  imports: [IssuesModule, EpicsModule],
  controllers: [BacklogController],
})
export class BacklogModule {}
