import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateEpicDto } from 'src/epics/dto/create-epic.dto';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
import { BacklogService } from './backlog.service';

@Controller('backlog')
export class BacklogController {
  constructor(private backlogService: BacklogService) {}

  @Get('items')
  findBacklogItems() {
    return this.backlogService.findBacklogItems();
  }

  @Post('issues')
  createIssue(@Body() issue: CreateIssueDto) {
    return this.backlogService.createIssue(issue);
  }

  @Post('epics')
  createEpic(@Body() epic: CreateEpicDto) {
    return this.backlogService.createEpic(epic);
  }

  @Post('order/:issueType/:id')
  moveBacklogItem(
    @Param('issueType') issueType,
    @Param('id') id,
    @Body('order') order,
  ) {
    return this.backlogService.moveBacklogItem(id, issueType, order);
  }

  @Post('epics/:epicId/issues/:issueId/order')
  moveIssueInEpic(
    @Param('epicId') epicId: number,
    @Param('issueId') issueId: number,
    @Body('order') order: number,
  ) {
    return this.backlogService.moveIssueInEpic(epicId, issueId, order);
  }
}
