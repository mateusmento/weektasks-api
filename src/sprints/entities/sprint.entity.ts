import { Issue } from 'src/issues/entities/issue.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

  @OneToMany(() => Issue, (i) => i.sprint)
  issues: Issue[];
}
