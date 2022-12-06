import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { Epic } from './entities/epic.entity';

@Injectable()
export class EpicsService {
  constructor(
    @InjectRepository(Epic)
    private epicRepo: Repository<Epic>,
  ) {}

  create(createEpicDto: CreateEpicDto) {
    return this.epicRepo.save(createEpicDto);
  }

  findAll() {
    return this.epicRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} epic`;
  }

  update(id: number, updateEpicDto: UpdateEpicDto) {
    return `This action updates a #${id} epic ${updateEpicDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} epic`;
  }
}
