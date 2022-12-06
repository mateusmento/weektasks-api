import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
}
