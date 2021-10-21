import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { LoginDTO } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }
}
