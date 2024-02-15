import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ToDoSchema } from './schemas/todo.schema';
import { FileSchema } from './schemas/file.schema';

@Module({
  imports: [MongooseModule.forFeature([{
    name: "Todo",
    schema: ToDoSchema
  }, {
    name: "TodoFile",
    schema: FileSchema
  }])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
