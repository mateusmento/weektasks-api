import { Issue } from 'src/issues/entities/issue.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Epic {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @CreateDateColumn()
  createdAt: string;

  @OneToMany(() => Issue, (i) => i.epic)
  issues: Issue[];
}
