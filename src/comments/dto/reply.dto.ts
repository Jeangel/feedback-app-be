import { Exclude, Expose, Type } from 'class-transformer';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { Reply } from '../schemas/reply.schema';
import { AuthorDTO } from './author.dto';

@Exclude()
export class ReplyDTO {
  @Expose()
  @TransformFromMongoId()
  _id: string;
  @Expose()
  body: string;
  @Expose()
  @Type(() => AuthorDTO)
  author: AuthorDTO;
  @Expose()
  createdAt: string;
  constructor(data: Partial<ReplyDTO | Reply>) {
    let author;
    if ((data as ReplyDTO).author) {
      author = (data as ReplyDTO).author;
    } else if ((data as Reply).authorId) {
      author = new AuthorDTO((data as Reply).authorId);
    }
    Object.assign(this, { ...data, author });
  }
}
