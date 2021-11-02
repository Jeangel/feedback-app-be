import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Reply, ReplySchema } from './reply.schema';
import { ECommentableResourceType } from '../enum/commentable-resource-type.enum';

export type CommentDocument = Comment & Document;

@Schema({ collection: 'comments', timestamps: true })
export class Comment {
  @Prop({ required: true, maxlength: 100_000 })
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resourceType',
    required: true,
  })
  resourceId: string;

  @Prop({ enum: Object.values(ECommentableResourceType), required: true })
  resourceType: ECommentableResourceType;

  @Prop({ type: [ReplySchema], default: [] })
  replies: Reply[];

  @Prop({ select: false })
  __v: number;

  @Prop()
  createdAt?: Date;

  @Prop({ select: false })
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
