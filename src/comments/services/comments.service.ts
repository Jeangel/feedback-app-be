import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuggestionsService } from 'src/suggestions/services/suggestions.service';
import { UsersService } from 'src/users/services/users.service';
import { AuthorDTO } from '../dto/author.dto';
import { CreateCommentRequestDTO } from '../dto/create-comment.dto';
import { CreateReplyRequestDTO } from '../dto/create-reply-dto';
import { FindCommentByIdResponseDTO } from '../dto/find-comment-by-id.dto';
import {
  FindCommentsByResourceIdDTO,
  FindCommentsByResourceIdResponseDTO,
} from '../dto/find-comments-by-resource-id.dto';
import { ReplyDTO } from '../dto/reply.dto';
import { ECommentableResourceType } from '../enum/commentable-resource-type.enum';
import { CommentDocument, Comment } from '../schemas/comment.schema';
import { Reply, ReplyDocument } from '../schemas/reply.schema';

interface IResourceExistsArgs {
  resourceId: string;
  resourceType: ECommentableResourceType;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
    private suggestionsService: SuggestionsService,
    private usersService: UsersService,
  ) {}

  private async resourceExists({
    resourceId,
    resourceType,
  }: IResourceExistsArgs) {
    switch (resourceType) {
      case ECommentableResourceType.suggestion:
        return this.suggestionsService.exists(resourceId);
      default:
        return false;
    }
  }

  async create({
    authorId,
    resourceId,
    resourceType,
    body,
  }: CreateCommentRequestDTO) {
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
      //Check _v when saving a document (test with users, suggestion, votes)
      // that field shouldn't be returned 🤔
      const comment = new this.commentModel({
        authorId,
        resourceId,
        resourceType,
        body,
      });
      const newComment = await comment.save();
      return this.findById(newComment._id);
    } catch (error) {
      throw error;
    }
  }

  async addReply(reply: CreateReplyRequestDTO) {
    try {
      const comment = await this.commentModel.findById(reply.commentId).exec();
      if (!comment) {
        throw new HttpException(
          `Given comment was not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      const replyInstance = new this.replyModel(reply);
      comment.replies.push(replyInstance);
      await comment.save();
      return this.findById(reply.commentId);
    } catch (error) {
      throw error;
    }
  }

  async findByResourceId({ resourceId }: FindCommentsByResourceIdDTO) {
    const comments = await this.commentModel
      .find({ resourceId })
      .populate(['authorId', 'replies.authorId'])
      .exec();
    return comments.map((comment) => {
      const commentJSON = comment.toObject();
      return new FindCommentsByResourceIdResponseDTO(commentJSON);
    });
  }
  async findById(id: string) {
    try {
      const comment = await this.commentModel
        .findById(id)
        .populate(['authorId', 'replies.authorId'])
        .exec();
      if (!comment) {
        throw new HttpException(
          `Given comment was not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      const commentJSON = comment.toObject();
      return new FindCommentByIdResponseDTO(commentJSON);
    } catch (error) {}
  }
}
