import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTokenDto } from '../dto/create-token.dto';
import { ResponseUserDto } from '../../users/dto/response-user.dto';
import { userToken, userTokenDocument } from '../schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(userToken.name, 'users')
    private readonly userTokenModel: Model<userTokenDocument>,
  ) {}

  async generateToken(payload: ResponseUserDto) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.PRIVATE_REFRESH_KEY,
      expiresIn: process.env.PRIVATE_REFRESH_TIME,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(tokenDto: CreateTokenDto) {
    const tokenData = await this.userTokenModel.findOne({
      user: tokenDto.userId,
    });
    if (tokenData) {
      tokenData.refreshToken = tokenDto.refreshToken;
      return tokenData.save();
    }
    const token = await this.userTokenModel.create(tokenDto);
    return token;
  }

  async findToken(refreshToken) {
    const userStorage = await this.userTokenModel.findOne({ refreshToken });
    return userStorage;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await this.userTokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async validateRefreshToken(token) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.PRIVATE_REFRESH_KEY,
      });
      return userData;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async validateAccessToken(token) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.PRIVATE_KEY,
      });
      return userData;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async findIdUser(token: string) {
    const { _id } = this.jwtService.verify(token, {
      secret: process.env.PRIVATE_REFRESH_KEY,
    });
    return _id;
  }
}
