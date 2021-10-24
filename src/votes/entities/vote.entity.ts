import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Transform } from 'class-transformer';

export interface IVoteEntityArgs {
  resourceId: string;
  authorId: string;
  value: number;
}

@Entity({ name: 'votes' })
export class VoteEntity {
  static createInstance(args: IVoteEntityArgs) {
    const vote = new VoteEntity();
    vote.resourceId = args.resourceId;
    vote.value = args.value;
    vote.authorId = args.authorId;
    return vote;
  }

  @ObjectIdColumn()
  @Transform(({ value }) => value.toHexString())
  id: ObjectID;

  @ObjectIdColumn()
  resourceId: ObjectID;

  @ObjectIdColumn()
  authorId: ObjectID;

  @Column()
  value: number;
}
