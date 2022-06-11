import { Expose, Transform } from 'class-transformer';
import {
  Length,
  MinLength,
  NotContains,
  IsUrl,
  IsDefined,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserRequestDTO {
  @Length(3, 100)
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[a-z\s]+$/i, { message: 'Name cannot contain symbols' })
  @Expose()
  fullName: string;

  @Length(3, 100)
  @IsUrl({}, { message: 'Name cannot contain symbols' })
  @Expose()
  avatarUrl: string;

  @Length(5, 20)
  @NotContains(' ', { message: 'Username cannot contains spaces' })
  @Expose()
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @MinLength(5)
  @Expose()
  password: string;
}
