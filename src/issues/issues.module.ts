import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entities/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue])],
  exports: [TypeOrmModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
