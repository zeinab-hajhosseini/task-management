import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDTO {
  @ApiProperty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
