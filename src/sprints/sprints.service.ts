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
    return this.sprintRepo.find({ relations: { issues: true } });
  }

  findOne(id: number) {
    return this.sprintRepo.findOne({
      where: { id },
      relations: { issues: true },
    });
  }

  async update(id: number, updateSprintDto: UpdateSprintDto) {
    const sprint = await this.findOne(id);
    sprint.title = updateSprintDto.title || sprint.title;
    return this.sprintRepo.save(sprint);
  }

  remove(id: number) {
    this.sprintRepo.delete(id);
  }

  createIssue(id: number) {
    this.findOne(id);
  }
}
