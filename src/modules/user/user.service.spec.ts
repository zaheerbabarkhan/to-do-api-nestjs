import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Schemas } from '../../schemas';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config/config';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/User.schema';
import { ToDoDocument, Todo } from '../../schemas/todo.schema';


const dbConfig = config.TEST_DB;

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;
  let todoModel: Model<ToDoDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [MongooseModule.forRoot(`mongodb+srv://${dbConfig.DB_USER}:${dbConfig.DB_PASSWORD}@cluster0.xlw87.mongodb.net/?retryWrites=true&w=majority`, {
        dbName: dbConfig.DB_NAME
      }),MongooseModule.forFeature(Schemas),JwtModule.register({
        secret: config.JWT.SECRET_KEY
      }),MailerModule.forRoot({
        transport: `smtps://${config.SMTP.SMTP_EMAIL}:${config.SMTP.SMTP_PASSWORD}@${config.SMTP.SMTP_HOST}`,
        defaults: {
          from: '"no-reply" <example@example.com>',
        }
      }), MailModule, RedisModule]
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    todoModel = module.get<Model<ToDoDocument>>(getModelToken(Todo.name));

    await userModel.deleteMany();
    await todoModel.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("create function", async () => {
    const createResult = await service.create({
      email: "createTest@email.com",
      firstName: "testname",
      lastName: "lastName",
      password: "test password"
    })
    
    expect(createResult).toHaveProperty("user");
    expect(createResult.user).toHaveProperty("_id")

    const newUser = await userModel.findOne({
      email: createResult.user.email
    })

    expect(newUser).toBeDefined();
  })
});
