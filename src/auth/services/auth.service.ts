import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { LoginRequestDTO, LoginResponseDTO } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDTO } from '../dto/register.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDTO) {
    const { password, _id: userId } = await this.usersService.findUserPassword(
      dto.username,
    );
    const unauthorizedError = new HttpException(
      'Invalid username or password',
      HttpStatus.UNAUTHORIZED,
    );
    if (!password) throw unauthorizedError;

    try {
      const isPasswordEqual = await bcrypt.compare(dto.password, password);
      if (!isPasswordEqual) throw unauthorizedError;

      const user = await this.usersService.findById(userId);
      const accessToken = this.jwtService.sign({
        username: dto.username,
        userId: user._id,
        sub: user._id,
      });
      return plainToClass(LoginResponseDTO, {
        user,
        token: accessToken,
      });
    } catch (error) {
      throw error;
    }
  }

  async register(dto: RegisterRequestDTO) {
    return this.usersService.create(dto);
  }
}
