import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { EFeedbackCategory } from '../enum/feedback-category';
import { User } from '../../users/schemas/user.schema';
import { EFeedbackStatus } from '../enum/feedback-status';

export type FeedbackDocument = Feedback & Document;

@Schema({ collection: 'feedback', timestamps: true })
export class Feedback {
  @Prop({ length: 50, required: true })
  title: string;

  @Prop({ length: 600, required: true })
  description: string;

  @Prop({ enum: EFeedbackCategory, required: true })
  category: EFeedbackCategory;

  @Prop({ enum: EFeedbackStatus, default: EFeedbackStatus.suggestion })
  status: EFeedbackStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User;

  @Prop({ select: false })
  __v: number;

  @Prop()
  createdAt?: Date;

  @Prop({ select: false })
  updatedAt?: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
