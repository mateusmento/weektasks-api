import { Injectable } from '@nestjs/common';
import { CreateBacklogItemDto } from './dto/create-backlog-item.dto';
import { UpdateBacklogItemDto } from './dto/update-backlog-item.dto';

@Injectable()
export class BacklogItemsService {
  create(createBacklogItemDto: CreateBacklogItemDto) {
    return 'This action adds a new backlogItem';
  }

  findAll() {
    return `This action returns all backlogItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} backlogItem`;
  }

  update(id: number, updateBacklogItemDto: UpdateBacklogItemDto) {
    return `This action updates a #${id} backlogItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} backlogItem`;
  }
}
