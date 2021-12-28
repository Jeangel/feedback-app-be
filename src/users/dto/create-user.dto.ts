import {
  Length,
  MinLength,
  NotContains,
  IsAlpha,
  IsUrl,
} from 'class-validator';

export class CreateUserDTO {
  @Length(3, 100)
  @IsAlpha(undefined, { message: 'Name cannot contain symbols' })
  fullName: string;

  @Length(3, 100)
  @IsUrl({}, { message: 'Name cannot contain symbols' })
  avatarUrl: string;

  @Length(5, 20)
  @NotContains(' ', { message: 'Username cannot contains spaces' })
  username: string;

  @MinLength(5)
  password: string;
}
