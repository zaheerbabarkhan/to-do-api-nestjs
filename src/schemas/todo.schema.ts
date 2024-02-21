import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import status from "../constants/status"
import { UserDocument } from './User.schema';
import { Type } from 'class-transformer';
import { TodoFile } from './file.schema';


export type ToDoDocument = HydratedDocument<Todo>;


@Schema({ 
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
  id: false
 })
export class Todo {
  @Prop({ required: true, maxlength: 255, type: String })
  title: string;

  @Prop({ maxlength: 1000, type: String })
  description: string;

  @Prop({ required: true, type: Date })
  dueDate: Date;

  @Prop({ required: true, default: status.PENDING })
  statusId: number;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId | UserDocument;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;

  @Type(() => TodoFile)
  files: TodoFile[]
}

export const ToDoSchema = SchemaFactory.createForClass(Todo);

ToDoSchema.virtual("files", {
  ref: TodoFile.name,
  localField: '_id',
  foreignField: 'todoId'
})