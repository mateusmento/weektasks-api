import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { filter, max, sortBy } from 'lodash';
import { CreateEpicDto } from 'src/epics/dto/create-epic.dto';
import { Epic } from 'src/epics/entities/epic.entity';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
import { Issue } from 'src/issues/entities/issue.entity';
import { Between, Equal, IsNull, Not, Repository } from 'typeorm';

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

  async moveBacklogItem(id: number, issueType: string, order: number) {
    if (issueType === 'epic') this.moveEpicInBacklog(id, order);
    else this.moveIssueInBacklog(id, order);
  }

  async moveIssueInBacklog(id: number, order: number) {
    const issue = await this.issueRepo.findOne({ where: { id } });
    const newOrder = order;
    const oldOrder = issue.orderInBacklog;

    this.issueRepo.update({ id }, { orderInBacklog: newOrder });

    if (oldOrder < newOrder) {
      this.issueRepo.update(
        {
          orderInBacklog: Between(oldOrder, newOrder),
          id: Not(Equal(id)),
        },
        { orderInBacklog: () => '"orderInBacklog" - 1' },
      );

      this.epicRepo.update(
        { orderInBacklog: Between(oldOrder, newOrder) },
        { orderInBacklog: () => '"orderInBacklog" - 1' },
      );
    } else {
      this.issueRepo.update(
        {
          orderInBacklog: Between(newOrder, oldOrder),
          id: Not(Equal(id)),
        },
        { orderInBacklog: () => '"orderInBacklog" + 1' },
      );

      this.epicRepo.update(
        { orderInBacklog: Between(newOrder, oldOrder) },
        { orderInBacklog: () => '"orderInBacklog" + 1' },
      );
    }
  }

  async moveEpicInBacklog(id: number, order: number) {
    const epic = await this.epicRepo.findOne({ where: { id } });
    const newOrder = order;
    const oldOrder = epic.orderInBacklog;

    this.epicRepo.update({ id }, { orderInBacklog: newOrder });

    if (oldOrder < newOrder) {
      this.epicRepo.update(
        {
          orderInBacklog: Between(oldOrder, newOrder),
          id: Not(Equal(id)),
        },
        { orderInBacklog: () => '"orderInBacklog" - 1' },
      );

      this.issueRepo.update(
        { orderInBacklog: Between(oldOrder, newOrder) },
        { orderInBacklog: () => '"orderInBacklog" - 1' },
      );
    } else {
      this.epicRepo.update(
        {
          orderInBacklog: Between(newOrder, oldOrder),
          id: Not(Equal(id)),
        },
        { orderInBacklog: () => '"orderInBacklog" + 1' },
      );

      this.issueRepo.update(
        { orderInBacklog: Between(newOrder, oldOrder) },
        { orderInBacklog: () => '"orderInBacklog" + 1' },
      );
    }
  }

  moveIssueInEpic(epicId: number, issueId: number, order: number) {}
}
