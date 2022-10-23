import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { RegistrationUserDto } from '../../users/dto/user.dto';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { TokenUserDto } from '../dto/token-user.dto';
import { TokenService } from './token.service';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  async registration(userDto: RegistrationUserDto, response) {
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

    const userClient = new TokenUserDto(user);

    const tokens = await this.tokenService.generateToken({ ...userClient });

    await this.tokenService.saveToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'strict',
      httpOnly: true,
    });
    return { accessToken: tokens.accessToken, user: userClient };
  }
}
