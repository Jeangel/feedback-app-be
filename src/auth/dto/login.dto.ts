import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { FindUserByIdResponseDTO } from 'src/users/dto/find-user-by-id-dto';

export class LoginRequestDTO {
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class LoginBodyDTO extends LoginRequestDTO {}

@Exclude()
export class LoginResponseDTO {
  @Expose()
  @Type(() => FindUserByIdResponseDTO)
  user: FindUserByIdResponseDTO;
  @Expose()
  token: string;
}
