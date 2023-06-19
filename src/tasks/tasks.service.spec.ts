import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  const mocktasksRepository = {};

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mocktasksRepository,
        },
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
  });

  it('Should be defined', () => {
    expect(tasksService).toBeDefined();
  });
});
