import { Controller, Get, Post } from '@nestjs/common';
import { CreateEpicDto } from 'src/epics/dto/create-epic.dto';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
import { BacklogService } from './backlog.service';

@Controller('backlog')
export class BacklogController {
  constructor(private backlogService: BacklogService) {}

  @Get('issues-and-epics')
  findIssuesAndEpics() {
    return this.backlogService.findIssuesAndEpics();
  }

  @Post('issues')
  createIssue(issue: CreateIssueDto) {
    return this.backlogService.createIssue(issue);
  }

  @Post('epics')
  createEpic(epic: CreateEpicDto) {
    return this.backlogService.createEpic(epic);
  }
}
