import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { ECommentableResourceType } from '../enum/commentable-resource-type.enum';

@Exclude()
export class AuthorDTO {
  @TransformFromMongoId()
  @Expose()
  _id: string;
  @Expose()
  fullName: number;
  @Expose()
  avatarUrl: number;
  @Expose()
  username: number;
  constructor(data: Partial<AuthorDTO>) {
    Object.assign(this, data);
  }
}

export class FindCommentsByResourceIdDTO {
  @IsMongoId()
  @IsNotEmpty()
  resourceId: string;
}

@Exclude()
export class FindCommentsByResourceIdResponseDTO {
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
  replies: [];
  constructor(data: Partial<FindCommentsByResourceIdResponseDTO>) {
    Object.assign(this, data);
  }
}
