import { Column, Entity, Index, ObjectID, ObjectIdColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

export interface IUserEntityArgs {
  username: string;
  password: string;
}

@Entity({ name: 'users' })
export class UserEntity {
  static createInstance(args: IUserEntityArgs) {
    const user = new UserEntity();
    user.username = args.username;
    user.password = args.password;
    return user;
  }

  @ObjectIdColumn()
  @Transform(({ value }) => value.toHexString())
  id: ObjectID;

  @Column({ length: 50 })
  @Index({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;
}
