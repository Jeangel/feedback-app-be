import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string) {
    return this.userModel.findOne({ username: username }).lean().exec();
  }

  async findAuthUserByUsername(username: string) {
    return this.userModel
      .findOne({ username: username })
      .lean()
      .select({ password: 1, username: 1, _id: 1 })
      .exec();
  }

  async exists(userId: string) {
    return this.userModel.exists({ _id: userId });
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async create(dto: CreateUserDTO) {
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
