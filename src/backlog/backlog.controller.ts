import { Controller, Get } from '@nestjs/common';

@Controller('backlog')
export class BacklogController {
  @Get('issues-and-epics')
  findIssuesAndEpics() {
    return [];
  }
}
