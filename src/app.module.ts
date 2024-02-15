import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://dingdong:dingdong7172@cluster0.xlw87.mongodb.net/?retryWrites=true&w=majority', {
    dbName: "todo_api"
  }), UserModule, TodoModule],
})
export class AppModule {}
