import { Allow, IsNotEmpty } from 'class-validator';

export class CreateIssueDto {
  @IsNotEmpty()
  title: string;
  @Allow()
  epic: { id: number };
  @Allow()
  sprint: { id: number };
}
