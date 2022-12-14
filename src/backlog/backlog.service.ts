import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { filter, max, sortBy } from 'lodash';
import { CreateEpicDto } from 'src/epics/dto/create-epic.dto';
import { Epic } from 'src/epics/entities/epic.entity';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
import { Issue } from 'src/issues/entities/issue.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class BacklogService {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>,
    @InjectRepository(Epic)
    private epicRepo: Repository<Epic>,
  ) {}

  async findBacklogItems() {
    const [issues, epics] = await Promise.all([
      this.issueRepo.find({ where: { epic: IsNull(), sprint: IsNull() } }),
      this.epicRepo.find({ relations: { issues: true } }),
    ]);

    return sortBy(
      [
        ...issues.map((i) => ({ issueType: 'issue', ...i })),
        ...epics.map((e) => ({ issueType: 'epic', ...e })),
      ],
      (i) => i.orderInBacklog,
    );
  }

  async createIssue(issue: CreateIssueDto) {
    const order = await this.findNextOrder();
    return this.issueRepo.save({ ...issue, orderInBacklog: order });
  }

  async createEpic(epic: CreateEpicDto) {
    const order = await this.findNextOrder();
    return this.epicRepo.save({ ...epic, orderInBacklog: order });
  }

  async findNextOrder() {
    const [issue, epic] = await Promise.all([
      this.issueRepo
        .createQueryBuilder('issue')
        .select('max(issue.orderInBacklog)', 'maxOrder')
        .getRawOne(),
      this.epicRepo
        .createQueryBuilder('epic')
        .select('max(epic.orderInBacklog)', 'maxOrder')
        .getRawOne(),
    ]);

    const orders = filter(
      [issue.maxOrder, epic.maxOrder, -1],
      (n) => typeof n === 'number',
    );

    return max(orders) + 1;
  }

  async moveBacklogItem() {}
}
