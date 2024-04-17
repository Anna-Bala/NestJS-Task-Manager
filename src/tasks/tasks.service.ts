import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './task.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tempTasks = this.getAllTasks();

    if (status) {
      tempTasks = tempTasks.filter((task) => task.status === status);
    }

    if (search) {
      tempTasks = tempTasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tempTasks;
  }

  public getTaskById(id: string): Task {
    const foundTask = this.tasks.find((task) => task.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return foundTask;
  }

  public createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      status: TaskStatus.OPEN,
      ...createTaskDto,
    };

    this.tasks.push(task);
    return task;
  }

  public deleteTask(id: string): void {
    const foundTask = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== foundTask.id);
  }

  public updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
