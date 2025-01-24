import { Injectable } from '@nestjs/common';
import { Task } from './task.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  create(task: Omit<Task, 'id'>): Task {
    const newTask = { ...task, id: uuid(), time: new Date().toLocaleTimeString(), completed: false };
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: string, updatedTask: Partial<Task>): Task {
    const task = this.findOne(id);
    if (task) {
      Object.assign(task, updatedTask);
    }
    return task;
  }

  // New simplified getTask method
  getTask(tTitle: string, tDes: string): Task[] {
    const tTime = new Date().toLocaleTimeString();
    const newTask = { id: uuid(), title: tTitle, description: tDes, time: tTime, completed: false };
    this.tasks.push(newTask);
    return this.tasks;
  }

  deleteTask(id: string): Task {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
      return this.tasks.splice(taskIndex, 1)[0];
    }
  }

  completeTask(id: string): Task {
    const task = this.findOne(id);
    if (task) {
      task.completed = true;
    }
    return task;
  }
}
