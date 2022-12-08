import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue } from './entities/issue.entity';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>,
  ) {}

  create(createIssueDto: CreateIssueDto) {
    return this.issueRepo.save(createIssueDto);
  }

  findAll() {
    return this.issueRepo
      .createQueryBuilder('issue')
      .where('issue.epic is null')
      .andWhere('issue.sprint is null')
      .getMany();
  }

  findOne(id: number) {
    return this.issueRepo.findOneBy({ id });
  }

  async update(id: number, updateIssueDto: UpdateIssueDto) {
    const issue = await this.findOne(id);
    issue.title = updateIssueDto.title || issue.title;
    return this.issueRepo.save(issue);
  }

  remove(id: number) {
    return this.issueRepo.delete(id);
  }
}
