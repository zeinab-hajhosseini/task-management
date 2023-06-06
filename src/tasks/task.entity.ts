import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity({
  name: 'Tasks',
  synchronize: true,
})
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}
