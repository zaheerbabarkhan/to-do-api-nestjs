import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Schemas } from '../../schemas';
import { RedisModule } from '../redis/redis.module';
import { S3Service } from '../s3/s3.service';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/User.schema';
import { ToDoDocument, Todo } from '../../schemas/todo.schema';
import { AccountType } from '../../types/user.types';

const dbConfig = config.TEST_DB;

describe('TodoService', () => {
  let service: TodoService;
  let userModel: Model<UserDocument>;
  let todoModel: Model<ToDoDocument>;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, S3Service],
      imports: [MongooseModule.forRoot(`mongodb+srv://${dbConfig.DB_USER}:${dbConfig.DB_PASSWORD}@cluster0.xlw87.mongodb.net/?retryWrites=true&w=majority`, {
        dbName: dbConfig.DB_NAME
      }),JwtModule.register({
        secret: config.JWT.SECRET_KEY
      }), MongooseModule.forFeature(Schemas), RedisModule]
    }).compile();

    service = module.get<TodoService>(TodoService);

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    todoModel = module.get<Model<ToDoDocument>>(getModelToken(Todo.name));

    await userModel.deleteMany();
    await todoModel.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("create function", async  () => {
    const newUser = await userModel.create({
      email: "createTodo@email.com",
      firstName: "testname",
      lastName: "testName",
      password: "test password",
      accountType: AccountType.APP
    });

    const newTodo = await service.create({
      title: "test todo title",
      dueDate: new Date(),
    }, null, newUser._id as unknown as  string);
    expect(newTodo).toBeDefined();
    expect(newTodo).toHaveProperty("_id")
  })
});
