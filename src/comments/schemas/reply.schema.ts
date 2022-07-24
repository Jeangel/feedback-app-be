import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ReplyDocument = Reply & Document;

@Schema({ timestamps: true })
export class Reply {
  @Prop({ required: true, maxlength: 100_000 })
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User;

  @Prop({ select: false })
  __v: number;

  @Prop()
  createdAt?: Date;

  @Prop({ select: false })
  updatedAt?: Date;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
