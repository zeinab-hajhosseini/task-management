import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserEntity } from '../auth/user.entity';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';

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

    updateTaskStatus: jest
      .fn()
      .mockImplementation(
        (id: string, status: TaskStatus, user: UserEntity) => {
          return {
            id,
            title: 'Sample',
            description: 'Sample',
            status,
          };
        },
      ),
  };

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'Test Task',
    description: 'This Task must be created',
  };

  const mockUpdateTaskDto: UpdateTaskStatusDTO = {
    status: TaskStatus.DONE,
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

    expect(mockTasksService.createTask).toBeCalledWith(
      mockCreateTaskDto,
      mockUser,
    );
  });

  it('Should be update Task', () => {
    expect(
      tasksController.updateTaskStatus('1', mockUpdateTaskDto, mockUser),
    ).toEqual({
      id: '1',
      title: 'Sample',
      description: 'Sample',
      status: mockUpdateTaskDto.status,
    });
    expect(mockTasksService.updateTaskStatus).toBeCalled();
  });
});
