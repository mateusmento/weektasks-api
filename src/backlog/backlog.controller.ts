import { Controller, Get } from '@nestjs/common';
import { BacklogService } from './backlog.service';

@Controller('backlog')
export class BacklogController {
  constructor(private backlogService: BacklogService) {}

  @Get('issues-and-epics')
  findIssuesAndEpics() {
    return [];
  }
}
