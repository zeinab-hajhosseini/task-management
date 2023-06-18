import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserEntity } from 'src/auth/user.entity';

const mocksHttp = require('node-mocks-http');

describe('TasksController', () => {
  let tasksService: TasksService;
  let tasksController: TasksController;

  const mockTasksService = {
    createTask: jest
      .fn()
      .mockImplementation((createTaskDto: CreateTaskDto, user: UserEntity) => {
        return {
          ...createTaskDto,
          status: 'OPEN',
          id: 1,
        };
      }),
  };

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'Test Task',
    description: 'This Task must be created',
  };

  const mockUser: UserEntity = {
    id: '1',
    username: 'test user',
    password: '1',
    tasks: [],
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'SECRET_KEY',
          signOptions: { expiresIn: '60s' },
        }),
      ],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    tasksController = moduleRef.get<TasksController>(TasksController);
  });

  it('Should be defined', () => {
    expect(tasksController).toBeDefined();
  });

  it('Should be create Task', () => {
    expect(tasksController.createTask(mockCreateTaskDto, mockUser)).toEqual({
      ...mockCreateTaskDto,
      status: 'OPEN',
      id: expect.any(Number),
    });
  });
});
