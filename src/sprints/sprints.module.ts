import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsController } from './sprints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { IssuesModule } from 'src/issues/issues.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint]), IssuesModule],
  controllers: [SprintsController],
  providers: [SprintsService],
})
export class SprintsModule {}
