import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import status from '../constants/status';
import { ToDoDocument } from './todo.schema';
import { S3Service } from 'src/modules/s3/s3.service';

export type FileDocument = HydratedDocument<TodoFile>;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
  id: false
})
export class TodoFile {
  @Prop({ required: true, maxlength: 255 })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Todo', required: true })
  todoId: MongooseSchema.Types.ObjectId | ToDoDocument;

  @Prop({ required: true, default: status.PENDING })
  statusId: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(TodoFile);

FileSchema.virtual("signedURL").get(function name() {
  return new S3Service().signedURL(this.title);
})
