import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import status from "../constants/status";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, id: false })
export class User {
  @Prop({ required: true, maxlength: 20 })
  firstName: string;

  @Prop({ maxlength: 20 })
  lastName: string;

  @Prop({ required: true, unique: true, maxlength: 250 })
  email: string;

  @Prop()
  accountType: string;

  @Prop()
  password: string;

  @Prop({ type: Number, default: status.PENDING })
  statusId: number;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
