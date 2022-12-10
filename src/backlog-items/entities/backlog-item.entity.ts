import { Epic } from 'src/epics/entities/epic.entity';
import { Issue } from 'src/issues/entities/issue.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BacklogItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double' })
  order: number;

  @Column()
  type: 'issue' | 'epic';

  @ManyToOne(() => Issue, { cascade: true })
  issue: Issue;

  @ManyToOne(() => Epic, { cascade: true })
  epic: Epic;
}
