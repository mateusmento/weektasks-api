import { Allow } from 'class-validator';

export class UpdateIssueDto {
  @Allow()
  title: string;
}
