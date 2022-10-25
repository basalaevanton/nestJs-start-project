import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AuthUserDto } from '../../users/dto/user.dto';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import { TokenService } from './token.service';
import { MailService } from './mail.service';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginRespDto } from '../dto/login-resp.dto';
import { ResponseUserDto } from '../../users/dto/response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, 'users')
    private readonly userModel: Model<UserDocument>,

    private tokenService: TokenService,
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  async registration(userDto: AuthUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const activationLink = uuid.v4();
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
      activationLink,
    });

    await this.mailService.sendActivationMail(
      userDto.email,
      `${process.env.API_URL}/auth/activate/${activationLink}`,
    );

    const userClient = new ResponseUserDto(user);

    const tokens = await this.tokenService.generateToken({ ...userClient });

    await this.tokenService.saveToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });

    throw new HttpException(
      `${userDto.email} успешно зарегестрирован в системе`,
      HttpStatus.OK,
    );
  }

  async activate(activationLink) {
    const user = await this.userModel.findOne({ activationLink });

    if (!user) {
      throw new HttpException(
        'Некоректная ссылка активации',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isActivated = true;
    await user.save();
  }

  async login(userDto: AuthUserDto, response): Promise<LoginRespDto> {
    const user = await this.validateUser(userDto);
    const userClient = new ResponseUserDto(user);

    const tokens = await this.tokenService.generateToken({ ...userClient });

    await this.tokenService.saveToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      expires: +process.env.COOKIE_PRIVATE_TIME * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      httpOnly: true,
    });

    return { user: userClient, accessToken: tokens.accessToken };
  }

  async validateUser(userDto: AuthUserDto): Promise<any> {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${userDto.email}`);
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный емайл',
    });
  }

  async logout(request, response) {
    const { refreshToken } = request.cookies;

    if (!refreshToken) {
      throw new UnauthorizedException({
        message: 'Неавторизованный пользователь',
      });
    }
    response.clearCookie('refreshToken');

    const token = await this.tokenService.removeToken(refreshToken);
    throw new HttpException('Успешно вышли из системы', HttpStatus.OK);
  }

  async refresh(request, response) {
    const { refreshToken } = request.cookies;

    if (!refreshToken) {
      throw new UnauthorizedException({
        message: 'Неавторизованный пользователь',
      });
    }

    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException({
        message: 'Неавторизованный пользователь',
      });
    }

    const userId = await this.tokenService.findIdUser(refreshToken);

    const user = await this.userService.getUserById(userId);
    const userClient = new ResponseUserDto(user);

    const tokens = await this.tokenService.generateToken({ ...userClient });
    await this.tokenService.saveToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      expires: +process.env.COOKIE_PRIVATE_TIME * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      httpOnly: true,
    });
    // вместо user возвращать роли и разрешения
    return { token: tokens.accessToken, user: userClient };
  }
}
