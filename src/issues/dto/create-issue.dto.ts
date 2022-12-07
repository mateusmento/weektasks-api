import { IsNotEmpty } from 'class-validator';

export class CreateIssueDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  epic: { id: number };
  @IsNotEmpty()
  sprint: { id: number };
}
