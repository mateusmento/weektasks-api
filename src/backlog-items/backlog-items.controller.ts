import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BacklogItemsService } from './backlog-items.service';
import { CreateBacklogItemDto } from './dto/create-backlog-item.dto';
import { UpdateBacklogItemDto } from './dto/update-backlog-item.dto';

@Controller('backlog-items')
export class BacklogItemsController {
  constructor(private readonly backlogItemsService: BacklogItemsService) {}

  @Post()
  create(@Body() createBacklogItemDto: CreateBacklogItemDto) {
    return this.backlogItemsService.create(createBacklogItemDto);
  }

  @Get()
  findAll() {
    return this.backlogItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backlogItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBacklogItemDto: UpdateBacklogItemDto,
  ) {
    return this.backlogItemsService.update(+id, updateBacklogItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backlogItemsService.remove(+id);
  }
}
