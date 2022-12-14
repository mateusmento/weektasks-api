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
}
