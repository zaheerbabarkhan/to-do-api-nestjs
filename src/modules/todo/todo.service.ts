import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ToDoDocument, Todo } from 'src/schemas/todo.schema';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { S3Service } from '../s3/s3.service';
import { TodoFile, FileDocument } from 'src/schemas/file.schema';
import status from 'src/constants/status';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AllTodoDTO } from './dto/all-todo.dto';
import moment from "moment";

@Injectable()
export class TodoService {

  constructor(@InjectModel(Todo.name) private readonly Todo: Model<ToDoDocument>,
    @InjectModel(TodoFile.name) private readonly TodoFile: Model<FileDocument>,
    private readonly s3Service: S3Service) { }


  async create(createTodoDto: CreateTodoDto, files: Array<Express.Multer.File>, userId: string) {
    const { title, description, dueDate } = createTodoDto;
    let newTodo = await this.Todo.create({
      title,
      description,
      dueDate,
      userId,
    });

    if (files && files.length) {
      const createFiles = [];
      for (const file of files) {

        try {
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
    newTodo = await this.Todo.findOne({
      _id: newTodo._id
    }).populate({
      path: "files"
    }).exec();
    return newTodo;

  }

  async findAll(filters: FilterQuery<Todo>, sort: string = "createdAt", sortDir: SortOrder = "asc", attributes: string) {
    const allowedAttributes = ["title", "description", "dueDate", "statusId", "completedAt", "userId", "createdAt"];
    for (const value of attributes.split(",")) {
      if (!allowedAttributes.includes(value)) {
        throw new BadRequestException(`${value} not in todo`)
      }
    }
    const todos = await this.Todo.find(filters).sort([[sort, sortDir]]).select(attributes.split(",").join(" ")).exec()
    return todos;
  }

  queryClause(allTodoDTO: AllTodoDTO, userId: string) {
    const {completedAt, dueDate, query, statusId} = allTodoDTO;
    let filters: FilterQuery<Todo> = {
      userId,
      statusId: {
        $ne: status.DELETED
      }
    }
    if (statusId) {
      filters = {
        ...filters,
        $or: [{
          statusId,
        }]
      }
    }
    if (query) {
      filters = {
        ...filters,
        $and: [{
          $or: [
            {
              title: {
                $regex: `.*${query}*.`
              }
            }, {
              description: {
                $regex: `.*${query}*.`
              }
            }
          ]
        }]
      }
    }
    if (completedAt) {
      const completedAtMoment = moment(completedAt).utc()
      filters = {
        ...filters,
        completedAt: {
          $gte: completedAtMoment.startOf("day"),
          $lt: completedAtMoment.endOf("day")
        }
      }
    }
    if (dueDate) {
      const dueDateMoment = moment(dueDate).utc()
      filters = {
        ...filters,
        dueDate: {
          $gte: dueDateMoment.startOf("day"),
          $lt: dueDateMoment.endOf("day")
        }
      }
    }
    return filters
  }
  async findOne(id: string, userId: string) {
    const todo = await this.Todo.findOne({
      _id: id,
      userId,
      statusId: {
        $ne: status.DELETED
      }
    })
      .populate({ path: "files" })
      .exec();
    if (!todo) {
      throw new NotFoundException("Todo not found");
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string, files: Array<Express.Multer.File>) {
    const { description, dueDate, markCompleted, title } = updateTodoDto;

    let todo = await this.Todo.findOne({
      _id: id,
      userId,
      statusId: {
        $ne: status.DELETED
      }
    });

    if (!todo) {
      throw new NotFoundException("Todo not found");
    }

    if (markCompleted) {
      todo.completedAt = new Date();
      todo.statusId = status.COMPLETED;
      await todo.save();
      return todo;
    }
    if (files && files.length) {
      const createFiles = [];
      for (const file of files) {

        try {
          const s3Key = this.s3Service.s3Key(file.originalname, `todo/${userId}`)
          await this.s3Service.upload(s3Key, file.buffer, file.mimetype);
          createFiles.push(this.TodoFile.create({
            title: s3Key,
            todoId: id,
          }));
        } catch (error) {
          console.log(error);
        }
      }
      await Promise.allSettled(createFiles);
    }
    if (description) {
      todo.description = description;
    }
    if (dueDate) {
      todo.dueDate = dueDate;
    }
    if (title) {
      todo.title = title;
    }

    await todo.save();

    return todo = await this.Todo.findOne({
      _id: id
    }).populate({
      path: "files"
    }).exec();;
  }

  async remove(id: string, userId: string) {
    const todo = await this.Todo.findOne({
      _id: id,
      userId,
      statusId: {
        $ne: status.DELETED
      }
    });

    if (!todo) {
      throw new NotFoundException("Todo not found");
    }

    todo.statusId = status.DELETED;
    todo.deletedAt = new Date();
    await todo.save();
    return {
      message: "Todo deleted successfully"
    }
  }
}
