import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import status from '../../../constants/status';
import { ToDoDocument } from './todo.schema';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true, maxlength: 255 })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ToDo', required: true })
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

export const FileSchema = SchemaFactory.createForClass(File);
