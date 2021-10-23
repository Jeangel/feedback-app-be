import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import { EFeedbackCategory } from '../enum/feedback-category';

export interface IFeedbackEntityArgs {
  title: string;
  description: string;
  category: EFeedbackCategory;
  upVotes?: number;
  downVotes?: number;
  authorId: string;
}

@Entity({ name: 'feedback' })
export class FeedbackEntity {
  static createInstance(args: IFeedbackEntityArgs) {
    const feedback = new FeedbackEntity();
    feedback.title = args.title;
    feedback.description = args.description;
    feedback.category = args.category;
    feedback.authorId = args.authorId;
    return feedback;
  }

  @ObjectIdColumn()
  id: ObjectID;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 200 })
  description: string;

  @Column({ type: 'enum', enum: EFeedbackCategory })
  category: EFeedbackCategory;

  @Column()
  downVotes = 0;

  @Column()
  upVotes = 0;

  @ObjectIdColumn()
  authorId: ObjectID;
}
