import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserRequestDTO } from '../dto/create-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { FindUserByIdResponseDTO } from '../dto/find-user-by-id-dto';
import { FindUserPasswordResponseDTO } from '../dto/find-user-password-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string) {
    const user = this.userModel.findOne({ username: username }).lean().exec();
    return plainToClass(FindUserByIdResponseDTO, user);
  }

  async findUserPassword(username: string) {
    const userPassword = await this.userModel
      .findOne({ username: username })
      .select({ password: 1, _id: 1 })
      .exec();
    return plainToClass(FindUserPasswordResponseDTO, {
      password: userPassword?.password,
      _id: userPassword?._id.toString(),
    });
  }

  async exists(userId: string) {
    return this.userModel.exists({ _id: userId });
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    return plainToClass(FindUserByIdResponseDTO, user);
  }

  async create(dto: CreateUserRequestDTO) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      const user = new this.userModel({
        username: dto.username,
        password: hashedPassword,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
      });
      const savedUser = await user.save();
      return this.findById(savedUser._id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
