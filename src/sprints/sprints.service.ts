import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './entities/sprint.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>,
  ) {}

  create(createSprintDto: CreateSprintDto) {
    return this.sprintRepo.save(createSprintDto);
  }

  findAll() {
    return this.sprintRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} sprint`;
  }

  update(id: number, updateSprintDto: UpdateSprintDto) {
    return `This action updates a #${id} sprint ${updateSprintDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} sprint`;
  }
}
