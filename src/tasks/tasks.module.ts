import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
