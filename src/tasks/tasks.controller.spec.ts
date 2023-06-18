import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

const mocksHttp = require('node-mocks-http');

describe('TasksController', () => {
  let tasksService: TasksService;
  let tasksController: TasksController;

  const mockTasksService = {};

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
});
