import { Length, MinLength, NotContains } from 'class-validator';

export class CreateUserDTO {
  @Length(5, 20)
  @NotContains(' ', { message: 'Username cannot contains spaces' })
  username: string;
  @MinLength(5)
  password: string;
}
