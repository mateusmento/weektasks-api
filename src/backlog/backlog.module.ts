import { Module } from '@nestjs/common';
import { EpicsModule } from 'src/epics/epics.module';
import { IssuesModule } from 'src/issues/issues.module';

@Module({
  imports: [IssuesModule, EpicsModule],
})
export class BacklogModule {}
