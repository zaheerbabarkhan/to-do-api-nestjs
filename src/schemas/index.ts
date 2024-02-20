import { MongooseModule } from "@nestjs/mongoose";
import { ToDoSchema } from "./todo.schema";
import { FileSchema } from "./file.schema";
import { UserSchema } from "./User.schema";

export const Schemas = [{
    name: "Todo",
    schema: ToDoSchema
  }, {
    name: "TodoFile",
    schema: FileSchema
  }, {
    name: "User",
    schema: UserSchema
  }];