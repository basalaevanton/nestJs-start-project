import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, 'users')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.create({
      email: dto.email,
      password: dto.password,
      isActivated: false,
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
