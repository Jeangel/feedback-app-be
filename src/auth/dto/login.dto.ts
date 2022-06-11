import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Type } from 'class-transformer';
import { CreateUserRequestDTO } from 'src/users/dto/create-user.dto';
import { FindUserByIdResponseDTO } from 'src/users/dto/find-user-by-id-dto';

export class LoginRequestDTO extends PickType(CreateUserRequestDTO, [
  'username',
  'password',
] as const) {}

export class LoginBodyDTO extends LoginRequestDTO {}

@Exclude()
export class LoginResponseDTO {
  @Expose()
  @Type(() => FindUserByIdResponseDTO)
  user: FindUserByIdResponseDTO;
  @Expose()
  token: string;
}
