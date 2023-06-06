import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Task } from "./task.entity";

@Injectable()
export class TasksRepository extends Repository<Task>{
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }
}