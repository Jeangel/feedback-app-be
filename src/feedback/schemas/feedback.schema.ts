import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { EFeedbackCategory } from '../enum/feedback-category';
import { User } from '../../users/schemas/user.schema';

export type FeedbackDocument = Feedback & Document;

@Schema({ collection: 'feedback', timestamps: true })
export class Feedback {
  @Prop({ length: 50, required: true })
  title: string;

  @Prop({ length: 200, required: true })
  description: string;

  @Prop({ enum: EFeedbackCategory, required: true })
  category: EFeedbackCategory;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User;

  @Prop({ select: false })
  __v: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
