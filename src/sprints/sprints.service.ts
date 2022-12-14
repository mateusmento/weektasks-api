import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { find, max } from 'lodash';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
import { Issue } from 'src/issues/entities/issue.entity';
import { Between, Equal, Not, Repository } from 'typeorm';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './entities/sprint.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>,
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>,
  ) {}

  async create(sprint: CreateSprintDto) {
    const max = await this.sprintRepo
      .createQueryBuilder('sprint')
      .select('max(sprint.order)', 'order')
      .getRawOne();
    const order = typeof max.order === 'number' ? max.order : -1;
    return this.sprintRepo.save({ ...sprint, order: order + 1 });
  }

  findAll() {
    return this.sprintRepo.find({
      relations: { issues: true },
      order: { order: 'asc' },
    });
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
    return this.issueRepo.save({ ...issue, sprint, orderInSprint: order + 1 });
  }

  async moveSprint(id: number, order: number) {
    const sprint = await this.sprintRepo.findOne({ where: { id } });
    const newOrder = order;
    const oldOrder = sprint.order;

    this.sprintRepo.update({ id }, { order: newOrder });

    if (oldOrder < newOrder) {
      this.sprintRepo.update(
        {
          id: Not(Equal(id)),
          order: Between(oldOrder, newOrder),
        },
        { order: () => 'order - 1' },
      );
    } else {
      this.sprintRepo.update(
        { id: Not(Equal(id)), order: Between(newOrder, oldOrder) },
        { order: () => 'order + 1' },
      );
    }
  }
}
