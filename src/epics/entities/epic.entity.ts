import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Issue } from 'src/issues/entities/issue.entity';
import { sortBy } from 'lodash';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Epic {
  @PrimaryGeneratedColumn()
  id: number;
  issueType = 'epic';
  @Column()
  title: string;
  @CreateDateColumn()
  createdAt: string;

  @Exclude()
  @OneToMany(() => Issue, (i) => i.epic)
  issues: Issue[];

  @Column({ nullable: true })
  orderInBacklog?: number;

  @Expose({ name: 'issues' })
  sortedIssues() {
    return sortBy(this.issues, (i) => i.orderInEpic);
  }
}
