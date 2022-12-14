import { Module } from '@nestjs/common';
import { EpicsService } from './epics.service';
import { EpicsController } from './epics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from './entities/epic.entity';
import { IssuesModule } from 'src/issues/issues.module';

@Module({
  imports: [TypeOrmModule.forFeature([Epic]), IssuesModule],
  controllers: [EpicsController],
  providers: [EpicsService],
})
export class EpicsModule {}
