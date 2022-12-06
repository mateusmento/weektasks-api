import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IssuesModule } from './issues/issues.module';
import { SprintsModule } from './sprints/sprints.module';
import { EpicsModule } from './epics/epics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'weektasks-db',
      port: 5432,
      username: 'weektasks',
      password: 'weektasks',
      database: 'weektasks',
      autoLoadEntities: true,
      synchronize: true,
    }),
    IssuesModule,
    SprintsModule,
    EpicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
