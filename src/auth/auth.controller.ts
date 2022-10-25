import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Response,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserDto } from '../users/dto/user.dto';
import { AuthService } from './services/auth.service';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginRespDto } from './dto/login-resp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  @ApiQuery({ type: AuthUserDto })
  @ApiOperation({
    summary: 'Регистрация пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Email успешно зарегестрирован в системе',
  })
  registration(@Body() userDto: AuthUserDto) {
    return this.authService.registration(userDto);
  }

  @Get('/activate/:link')
  @ApiOperation({
    summary: 'Активация аккаунта',
  })
  @ApiResponse({
    status: 308,
    description: 'Your account is activated now',
  })
  activateAcc(@Param('link') link: string, @Res() res) {
    this.authService.activate(link);
    return res.redirect(process.env.CLIENT_URL);
  }

  @Post('/login')
  @ApiQuery({ type: AuthUserDto })
  @ApiResponse({
    status: 200,
    type: LoginRespDto,
    description: 'Successfully authenticated & SetCookie',
    headers: {
      setCookie: {
        description: 'Set-Cookie',
        schema: {
          type: 'string',
          example: 'refreshToken=abcde12345 HttpOnly',
        },
      },
    },
  })
  async login(
    @Body() userDto: AuthUserDto,
    @Response({ passthrough: true }) response,
  ) {
    return this.authService.login(userDto, response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiOperation({
    summary: 'Logout пользователя из приложения',
  })
  @ApiResponse({
    status: 200,
    description: 'Выход из системы',
    headers: {
      setCookie: {
        description: 'Del-Cookie',
        schema: {
          type: 'string',
          example: 'refreshToken="" HttpOnly',
        },
      },
    },
  })
  logout(@Req() request: Request, @Response({ passthrough: true }) response) {
    return this.authService.logout(request, response);
  }

  @ApiOperation({
    summary: 'Обновление токенов',
  })
  @ApiHeader({
    name: 'Обновление токенов',
    description: 'Обновление токенов с проверкой refreshToken из cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'Обновление токенов',
    headers: {
      setCookie: {
        description: 'Set-Cookie',
        schema: {
          type: 'string',
          example: 'refreshToken=abcde12345 HttpOnly',
        },
      },
    },
  })
  @Get('/refresh')
  @ApiCookieAuth()
  refresh(@Req() request: Request, @Response({ passthrough: true }) response) {
    return this.authService.refresh(request, response);
  }
}
