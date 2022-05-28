import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { EVotableResourceType } from '../enum/votable-resource-type.enum';

export type VoteDocument = Vote & Document;

@Schema({ collection: 'votes', timestamps: true })
export class Vote {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resourceType',
    required: true,
  })
  resourceId: string;

  @Prop({ enum: Object.values(EVotableResourceType), required: true })
  resourceType: EVotableResourceType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: string;

  @Prop({ enum: [-1, 0, 1], required: true })
  value: number;

  @Prop({ select: false })
  __v: number;

  @Prop({ select: false })
  createdAt?: Date;

  @Prop({ select: false })
  updatedAt?: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
