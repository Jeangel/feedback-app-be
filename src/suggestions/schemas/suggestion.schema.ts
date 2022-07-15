import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ESuggestionCategory } from '../enum/suggestion-category';
import { User } from '../../users/schemas/user.schema';
import { ESuggestionStatus } from '../enum/suggestion-status';

export type SuggestionDocument = Suggestion & Document;

@Schema({ collection: 'suggestions', timestamps: true })
export class Suggestion {
  @Prop({ length: 50, required: true })
  title: string;

  @Prop({ length: 600, required: true })
  description: string;

  @Prop({ enum: ESuggestionCategory, required: true })
  category: ESuggestionCategory;

  @Prop({ enum: ESuggestionStatus, default: ESuggestionStatus.suggestion })
  status: ESuggestionStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User;

  @Prop({ select: false })
  __v: number;

  @Prop()
  createdAt?: Date;

  @Prop({ select: false })
  updatedAt?: Date;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
