import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';

@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  create(@Body() createSprintDto: CreateSprintDto) {
    return this.sprintsService.create(createSprintDto);
  }

  @Get()
  findAll() {
    return this.sprintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sprintsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    return this.sprintsService.update(+id, updateSprintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sprintsService.remove(+id);
  }

  @Post(':id/issues')
  createIssue(@Param('id') id: number, @Body() issue: CreateIssueDto) {
    return this.sprintsService.createIssue(id, issue);
  }
}
