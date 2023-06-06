import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    const query = this.tasksRepository.createQueryBuilder('task');

    const { status, search } = filterDto;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ${id} ID not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} ID not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.tasksRepository.save(task);
    return task;
  }
}
