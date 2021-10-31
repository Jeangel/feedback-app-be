import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { FindCommentsByResourceIdDTO } from '../dto/find-comments-by-resource-id.dto';
import { CommentDocument, Comment } from '../schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  create({ authorId, resourceId, resourceType, body }: CreateCommentDTO) {
    try {
      //TODO validate authorId and resourceId exist
      //Check _v when saving a document (test with users, feedback, votes)
      const comment = new this.commentModel({
        authorId,
        resourceId,
        resourceType,
        body,
      });
      return comment.save();
    } catch (error) {
      throw error;
    }
  }

  findByResourceId({ resourceId }: FindCommentsByResourceIdDTO) {
    return this.commentModel.find({ resourceId });
  }
}
