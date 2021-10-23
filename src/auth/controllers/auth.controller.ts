import {
  Body,
  Controller,
  Post,
  HttpCode,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { LoginDTO } from '../dto/login.dto';
import { RegisterDTO } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(200)
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Public()
  @Post('/register')
  @UseInterceptors(ClassSerializerInterceptor)
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }
}
