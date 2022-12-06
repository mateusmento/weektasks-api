import { IsNotEmpty } from 'class-validator';

export class CreateEpicDto {
  @IsNotEmpty()
  title: string;
}
