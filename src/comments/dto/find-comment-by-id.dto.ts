import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { ECommentableResourceType } from '../enum/commentable-resource-type.enum';
import { Comment } from '../schemas/comment.schema';
import { AuthorDTO } from './author.dto';
import { ReplyDTO } from './reply.dto';

export class FindCommentByIdDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

@Exclude()
export class FindCommentByIdResponseDTO {
  @Expose()
  @TransformFromMongoId()
  _id: string;
  @Expose()
  body: string;
  @Expose()
  @Type(() => AuthorDTO)
  author: AuthorDTO;
  @Expose()
  resourceType: ECommentableResourceType;
  @Expose()
  @TransformFromMongoId()
  resourceId: string;
  @Expose()
  createdAt: string;
  @Expose()
  @Type(() => ReplyDTO)
  replies: ReplyDTO[];
  constructor(data: Partial<FindCommentByIdResponseDTO | Comment>) {
    let replies;
    let author;
    if ((data as FindCommentByIdResponseDTO).author) {
      author = (data as FindCommentByIdResponseDTO).author;
    } else if ((data as Comment).authorId) {
      author = new AuthorDTO((data as Comment).authorId);
    }
    if (data.replies) {
      replies = (data as Comment).replies.map((reply) => new ReplyDTO(reply));
    }
    Object.assign(this, { ...data, author, replies });
  }
}
