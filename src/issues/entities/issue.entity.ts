import { Epic } from 'src/epics/entities/epic.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => Epic, (e) => e.issues, { onDelete: 'SET NULL' })
  epic: Epic;

  @ManyToOne(() => Sprint, (s) => s.issues, { onDelete: 'SET NULL' })
  sprint: Sprint;

  @Column({ nullable: true })
  orderInEpic?: number;

  @Column({ nullable: true })
  orderInSprint?: number;
}
