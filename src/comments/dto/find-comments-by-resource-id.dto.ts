import { IsNotEmpty, IsMongoId } from 'class-validator';

export class FindCommentsByResourceIdDTO {
  @IsMongoId()
  @IsNotEmpty()
  resourceId: string;
}
