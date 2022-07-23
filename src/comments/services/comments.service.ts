import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuggestionsService } from 'src/suggestions/services/suggestions.service';
import { UsersService } from 'src/users/services/users.service';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import {
  AuthorDTO,
  FindCommentsByResourceIdDTO,
  FindCommentsByResourceIdResponseDTO,
} from '../dto/find-comments-by-resource-id.dto';
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

  async findByResourceId({ resourceId }: FindCommentsByResourceIdDTO) {
    const comments = await this.commentModel
      .find({ resourceId })
      .populate('authorId')
      .exec();
    return comments.map((comment) => {
      const commentJSON = comment.toObject();
      const author = commentJSON.authorId as unknown as AuthorDTO;

      return new FindCommentsByResourceIdResponseDTO({
        ...commentJSON,
        _id: commentJSON._id,
        author: new AuthorDTO(author),
        createdAt: commentJSON.createdAt?.toISOString(),
        replies: [],
      });
    });
  }
  findById(id: string) {
    return this.commentModel.findById(id).exec();
  }
}
