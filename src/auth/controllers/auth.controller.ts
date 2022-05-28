import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { LoginBodyDTO } from '../dto/login.dto';
import { RegisterBodyDTO } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(200)
  login(@Body() loginDTO: LoginBodyDTO) {
    return this.authService.login(loginDTO);
  }

  @Public()
  @Post('/register')
  register(@Body() dto: RegisterBodyDTO) {
    return this.authService.register(dto);
  }
}
