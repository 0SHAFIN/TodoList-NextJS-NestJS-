import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.interface';
import { get } from 'http';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Post('fname')
  getTask(@Body() task: Task): Task[] {
    return this.tasksService.getTask(task.title, task.description);
  }
  
  @Post()
  create(@Body() task: Omit<Task, 'id'>): Task {
    return this.tasksService.create(task);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatedTask: Partial<Task>): Task {
    return this.tasksService.update(id, updatedTask);
  }
  @Delete(':id')
  deleteTask(@Param('id') id: string): string {
    this.tasksService.deleteTask(id);
    return `Task with ID ${id} has been deleted`;
  }



 
}
