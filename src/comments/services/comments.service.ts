import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackService } from 'src/feedback/services/feedback.service';
import { UsersService } from 'src/users/services/users.service';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { FindCommentsByResourceIdDTO } from '../dto/find-comments-by-resource-id.dto';
import { ECommentableResourceType } from '../enum/commentable-resource-type.enum';
import { CommentDocument, Comment } from '../schemas/comment.schema';

interface IResourceExistsArgs {
  resourceId: string;
  resourceType: ECommentableResourceType;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private feedbackService: FeedbackService,
    private usersService: UsersService,
  ) {}

  private async resourceExists({
    resourceId,
    resourceType,
  }: IResourceExistsArgs) {
    switch (resourceType) {
      case ECommentableResourceType.feedback:
        return this.feedbackService.exists(resourceId);
      default:
        return false;
    }
  }

  async create({ authorId, resourceId, resourceType, body }: CreateCommentDTO) {
    try {
      const userExists = await this.usersService.exists(authorId);
      if (!userExists) {
        throw new HttpException(
          "Given author doesn't exists",
          HttpStatus.NOT_FOUND,
        );
      }
      const resourceExists = await this.resourceExists({
        resourceId,
        resourceType,
      });
      if (!resourceExists) {
        throw new HttpException(
          `Given resource ${resourceType} doesn't exists`,
          HttpStatus.NOT_FOUND,
        );
      }
      //Check _v when saving a document (test with users, feedback, votes)
      // that field shouldn't be returned 🤔
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
