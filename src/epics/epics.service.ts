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
    return this.epicRepo.find({ relations: { issues: true } });
  }

  findOne(id: number) {
    return this.epicRepo.findOne({
      where: { id },
      relations: { issues: true },
    });
  }

  async update(id: number, updateEpicDto: UpdateEpicDto) {
    const epic = await this.findOne(id);
    epic.title = updateEpicDto.title || epic.title;
    return this.epicRepo.save(epic);
  }

  remove(id: number) {
    return this.epicRepo.delete(id);
  }
}
