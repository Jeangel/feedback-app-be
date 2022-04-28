import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDTO) {
    const user = await this.usersService.findAuthUserByUsername(dto.username);
    const unauthorizedError = new HttpException(
      'Invalid username or password',
      HttpStatus.UNAUTHORIZED,
    );
    if (!user) throw unauthorizedError;

    try {
      const isPasswordEqual = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordEqual) throw unauthorizedError;
      const { password, ...result } = user;
      const accessToken = this.jwtService.sign({
        username: dto.username,
        userId: user._id,
        sub: user._id,
      });
      return {
        user: result,
        token: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async register(dto: RegisterDTO) {
    return this.usersService.create(dto);
  }
}
