import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findById(id: string) {
    return this.usersService.findById(id);
  }

  // TODO: Kill me
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() dto: CreateUserDTO) {
    return this.usersService.create(dto);
  }
}
