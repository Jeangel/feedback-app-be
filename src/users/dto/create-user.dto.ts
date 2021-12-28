import {
  Length,
  MinLength,
  NotContains,
  IsUrl,
  IsDefined,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDTO {
  @Length(3, 100)
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[a-z\s]+$/i, { message: 'Name cannot contain symbols' })
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
