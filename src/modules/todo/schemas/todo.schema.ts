import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import status from "../../../constants/status"


export type ToDoDocument = HydratedDocument<ToDo>;


@Schema({ timestamps: true })
export class ToDo {
  @Prop({ required: true, maxlength: 255, type: String })
  title: string;

  @Prop({ maxlength: 1000, type: String })
  description: string;

  @Prop({ required: true, type: Date })
  dueDate: Date;

  @Prop({ required: true, default: status.ACTIVE })
  statusId: number;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ required: true })
  userId: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const ToDoSchema = SchemaFactory.createForClass(ToDo);
