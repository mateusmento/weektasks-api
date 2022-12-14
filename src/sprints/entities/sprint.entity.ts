import { Exclude, Expose } from 'class-transformer';
import { sortBy } from 'lodash';
import { Issue } from 'src/issues/entities/issue.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

  @Exclude()
  @OneToMany(() => Issue, (i) => i.sprint)
  issues: Issue[];

  @Expose({ name: 'issues' })
  get sortedIssues() {
    return sortBy(this.issues, (i) => i.orderInSprint);
  }
}
