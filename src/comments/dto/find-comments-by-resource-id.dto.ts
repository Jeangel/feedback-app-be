import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Comment } from '../schemas/comment.schema';
import { FindCommentByIdResponseDTO } from './find-comment-by-id.dto';

export class FindCommentsByResourceIdDTO {
  @IsMongoId()
  @IsNotEmpty()
  resourceId: string;
}

@Exclude()
export class FindCommentsByResourceIdResponseDTO extends FindCommentByIdResponseDTO {
  constructor(data: Partial<FindCommentsByResourceIdResponseDTO | Comment>) {
    super(data);
  }
}
