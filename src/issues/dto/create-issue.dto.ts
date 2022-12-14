import { Allow, IsNotEmpty } from 'class-validator';

export class CreateIssueDto {
  @IsNotEmpty()
  title: string;
  @Allow()
  sprint: { id: number };
  order: number;
}
