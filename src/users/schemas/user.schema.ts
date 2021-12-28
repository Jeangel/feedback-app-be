import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ length: 100, required: true })
  fullName: string;

  @Prop({ required: true })
  avatarUrl: string;

  @Prop({ length: 50, unique: true, required: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ select: false })
  __v: number;

  @Prop({ select: false })
  createdAt?: Date;

  @Prop({ select: false })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
