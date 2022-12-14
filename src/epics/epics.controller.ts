import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EpicsService } from './epics.service';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';

@Controller('epics')
export class EpicsController {
  constructor(private readonly epicsService: EpicsService) {}

  @Post()
  create(@Body() createEpicDto: CreateEpicDto) {
    return this.epicsService.create(createEpicDto);
  }

  @Get()
  findAll() {
    return this.epicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.epicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEpicDto: UpdateEpicDto) {
    return this.epicsService.update(+id, updateEpicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.epicsService.remove(+id);
  }

  @Post(':id/issues')
  createIssue(@Param('id') id: number, @Body() issue: CreateIssueDto) {
    return this.epicsService.createIssue(id, issue);
  }
}
