import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { find, max } from 'lodash';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
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

  async createIssue(id: number, issue: CreateIssueDto) {
    const sprint = await this.findOne(id);
    const maxOrder = max(sprint.issues.map((i) => i.orderInSprint));
    const order = find(
      [issue.order, maxOrder, -1],
      (n) => typeof n === 'number',
    );
  }
}
