import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export interface IFeedbackEntityArgs {
  title: string;
  description: string;
  category: string;
  upVotes?: number;
  downVotes?: number;
}

@Entity({ name: 'feedback' })
export class FeedbackEntity {
  static createInstance(args: IFeedbackEntityArgs) {
    const todo = new FeedbackEntity();
    todo.title = args.title;
    todo.description = args.description;
    todo.category = args.category;
    return todo;
  }

  @ObjectIdColumn()
  id: ObjectID;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 200 })
  description: string;

  @Column()
  category: string;

  @Column()
  downVotes = 0;

  @Column()
  upVotes = 0;
}
