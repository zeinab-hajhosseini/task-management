import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { TaskEntity } from './task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;

  const mockUser: UserEntity = {
    id: '1',
    username: 'test user',
    password: '1',
    tasks: [],
  };

  const mocktasksRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: Date.now,
        ...user,
      }),
    ),
  };

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

  it('Should create a new task and return value', async () => {
    expect(
      await tasksService.createTask(
        {
          title: 'Title',
          description: 'Description',
        },
        mockUser,
      ),
    ).toEqual({
      description: 'Description',
      status: 'OPEN',
      title: 'Title',
      user: mockUser,
    });
  });
});
