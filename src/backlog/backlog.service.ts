import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sortBy } from 'lodash';
import { CreateEpicDto } from 'src/epics/dto/create-epic.dto';
import { Epic } from 'src/epics/entities/epic.entity';
import { CreateIssueDto } from 'src/issues/dto/create-issue.dto';
import { Issue } from 'src/issues/entities/issue.entity';
import { Repository, Between, Equal, IsNull, Not, MoreThan } from 'typeorm';

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

    return sortBy([...issues, ...epics], (i) => i.orderInBacklog);
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

    return Math.max(issue.maxOrder ?? -1, epic.maxOrder ?? -1) + 1;
  }

  async removeIssueInBacklog(id: number) {
    const issue = await this.issueRepo.findOneBy({
      id,
      epic: IsNull(),
      sprint: IsNull(),
    });
    this.issueRepo.delete(id);
    this.issueRepo.update(
      {
        id: Not(Equal(id)),
        epic: IsNull(),
        sprint: IsNull(),
        orderInBacklog: MoreThan(issue.orderInBacklog),
      },
      { orderInBacklog: () => '"orderInBacklog" - 1' },
    );
    this.epicRepo.update(
      { orderInBacklog: MoreThan(issue.orderInBacklog) },
      { orderInBacklog: () => '"orderInBacklog" - 1' },
    );
  }

  async removeEpicInBacklog(id: number) {
    const epic = await this.epicRepo.findOneBy({ id });
    const order = epic.orderInBacklog;
    this.epicRepo.delete(id);
    this.epicRepo.update(
      { id: Not(Equal(id)), orderInBacklog: MoreThan(order) },
      { orderInBacklog: () => '"orderInBacklog" - 1' },
    );
    this.issueRepo.update(
      { orderInBacklog: MoreThan(order) },
      { orderInBacklog: () => '"orderInBacklog" - 1' },
    );
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

  async moveIssueInEpic(epicId: number, issueId: number, order: number) {
    const issue = await this.issueRepo.findOne({ where: { id: issueId } });
    const newOrder = order;
    const oldOrder = issue.orderInEpic;
    this.issueRepo.update({ id: issueId }, { orderInEpic: newOrder });

    if (oldOrder < newOrder) {
      this.issueRepo.update(
        {
          id: Not(Equal(issueId)),
          epic: { id: epicId },
          orderInEpic: Between(oldOrder, newOrder),
        },
        { orderInEpic: () => '"orderInEpic" - 1' },
      );
    } else {
      this.issueRepo.update(
        {
          id: Not(Equal(issueId)),
          epic: { id: epicId },
          orderInEpic: Between(newOrder, oldOrder),
        },
        { orderInEpic: () => '"orderInEpic" + 1' },
      );
    }
  }

  async moveIssueToBacklog(issueId: number, order: number) {
    const nextOrder = await this.findNextOrder();
    await this.issueRepo.update(
      { id: issueId },
      { orderInBacklog: nextOrder, epic: null, sprint: null },
    );
    this.moveIssueInBacklog(issueId, order);
  }

  async moveIssueToEpic(epicId: number, issueId: number, order: number) {
    const nextOrder = await this.findNextOrderInEpic(epicId);
    await this.issueRepo.update(
      { id: issueId },
      { orderInEpic: nextOrder, epic: { id: epicId }, sprint: null },
    );
    this.moveIssueInEpic(epicId, issueId, order);
  }

  async findNextOrderInEpic(epicId: number) {
    const max = await this.issueRepo
      .createQueryBuilder('issue')
      .select('max(issue.orderInEpic)', 'order')
      .where('issue.epic.id = :epicId', { epicId })
      .getRawOne();
    return (max.order ?? -1) + 1;
  }

  async removeIssueFromBacklog(id: number) {
    const issue = await this.issueRepo.findOneBy({ id });
    this.issueRepo.update(
      {
        id: Not(Equal(id)),
        epic: IsNull(),
        sprint: IsNull(),
        orderInBacklog: MoreThan(issue.orderInBacklog),
      },
      { orderInBacklog: () => '"orderInBacklog" - 1' },
    );
    this.epicRepo.update(
      { orderInBacklog: MoreThan(issue.orderInBacklog) },
      { orderInBacklog: () => '"orderInBacklog" - 1' },
    );
  }

  async removeIssueFromEpic(epicId: number, id: number) {
    const issue = await this.issueRepo.findOneBy({ id });
    this.issueRepo.update(
      {
        id: Not(Equal(id)),
        epic: { id: epicId },
        orderInEpic: MoreThan(issue.orderInEpic),
      },
      { orderInEpic: () => '"orderInEpic" - 1' },
    );
  }
}
