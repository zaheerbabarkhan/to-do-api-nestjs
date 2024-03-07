import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User, UserDocument } from '../src/schemas/User.schema';
import { Model } from 'mongoose';
import { ToDoDocument, Todo } from '../src/schemas/todo.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import config from '../src/config/config';
import { Schemas } from '../src/schemas';
import { AccountType } from '../src/types/user.types';
import status from '../src/constants/status';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('Todo Controller (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;
  let todoModel: Model<ToDoDocument>;
  const dbConfig = config.TEST_DB;
  let jwtService: JwtService;

  let newUser: UserDocument;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot(`mongodb+srv://${dbConfig.DB_USER}:${dbConfig.DB_PASSWORD}@cluster0.xlw87.mongodb.net/?retryWrites=true&w=majority`, {
        dbName: dbConfig.DB_NAME
      }),MongooseModule.forFeature(Schemas), JwtModule.register({
        secret: config.JWT.SECRET_KEY,
      })],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<UserDocument>>(getModelToken(User.name))
    todoModel = moduleFixture.get<Model<ToDoDocument>>(getModelToken(Todo.name))
    jwtService = new JwtService({
      secret: config.JWT.SECRET_KEY
    })
    await app.init();
    await userModel.deleteMany();
    await todoModel.deleteMany();

    newUser = await userModel.create({
      firstName: "testName",
      lastName: "testName",
      accountType: AccountType.SOCIAL,
      password: "encryptedPassword",
      email: "test@test.com",
      statusId: status.ACTIVE

    })
    token = jwtService.sign({
      userId: newUser._id
    })
  });

  afterEach(async () => {
    await app.close();
  });

  it("Todo Create", async () => {
    
    const response = await request(app.getHttpServer()).post("/todos")
    .field("title", "Test todo")
    .field("dueDate", `${new Date()}`)
    .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("_id")
                            
  })

  it("Todo Get", async () => {
    const newTodo = await todoModel.create({
      title: "todoTest",
      description: "todo test description",
      dueDate: new Date(),
      userId: newUser._id
    })
    const response = await request(app.getHttpServer()).get(`/todos/${newTodo._id}`)
    .set('Authorization', `Bearer ${token}`);
    console.log(response.body);
    expect(response.body).toHaveProperty("_id");
    expect(response.body._id).toBe(`${newTodo._id}`);
  })
});
