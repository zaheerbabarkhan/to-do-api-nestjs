import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ToDoDocument, Todo } from 'src/schemas/todo.schema';
import { Model } from 'mongoose';
import { S3Service } from '../s3/s3.service';
import { TodoFile, FileDocument } from 'src/schemas/file.schema';

@Injectable()
export class TodoService {

  constructor(@InjectModel(Todo.name) private readonly Todo: Model<ToDoDocument>,
    @InjectModel(TodoFile.name) private readonly TodoFile: Model<FileDocument>,
    private readonly s3Service: S3Service) { }


  async create(createTodoDto: CreateTodoDto, files: Array<Express.Multer.File>, userId: string) {
    const { title, description, dueDate } = createTodoDto;
    const newTodo = await this.Todo.create({
      title,
      description,
      dueDate,
      userId,
    });

    if (files.length) {
      const createFiles = [];
      for (const file of files) {

        try {
          console.log(file.originalname);
          const s3Key = this.s3Service.s3Key(file.originalname, `todo/${userId}`)
          await this.s3Service.upload(s3Key, file.buffer, file.mimetype);
          createFiles.push(this.TodoFile.create({
            title: s3Key,
            todoId: newTodo._id,
          }));
        } catch (error) {
          console.log(error);
        }
      }
      await Promise.allSettled(createFiles);
    }
    // return newTodo

  }

  // findAll() {
  //   return `This action returns all todo`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} todo`;
  // }

  // update(id: number, updateTodoDto: UpdateTodoDto) {
  //   return `This action updates a #${id} todo`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} todo`;
  // }
}
