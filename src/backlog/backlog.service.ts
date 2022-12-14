import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sortBy } from 'lodash';
import { Epic } from 'src/epics/entities/epic.entity';
import { Issue } from 'src/issues/entities/issue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BacklogService {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>,
    @InjectRepository(Epic)
    private epicRepo: Repository<Epic>,
  ) {}

  async findIssuesAndEpics() {
    const [issues, epics] = await Promise.all([
      this.issueRepo.find(),
      this.epicRepo.find({ relations: { issues: true } }),
    ]);

    return sortBy([...issues, ...epics], (i) => i.orderInBacklog);
  }

  async createIssue() {
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

    const order = Math.max(issue.maxOrder, epic.maxOrder, -1);

    this.issueRepo.save({ orderInBacklog: order });
  }
}
