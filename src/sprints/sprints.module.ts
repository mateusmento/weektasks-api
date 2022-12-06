import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsController } from './sprints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [SprintsController],
  providers: [SprintsService],
})
export class SprintsModule {}
