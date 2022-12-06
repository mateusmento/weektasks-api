import { IsNotEmpty } from 'class-validator';

export class CreateSprintDto {
  @IsNotEmpty()
  title: string;
}
