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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from '../users/dto/user.dto';
import { AuthService } from './services/auth.service';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  @ApiOperation({
    summary: 'Регистрация пользователя',
  })
  registration(
    @Body() userDto: AuthUserDto,
    @Response({ passthrough: true }) response,
  ) {
    return this.authService.registration(userDto, response);
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
  async login(
    @Body() userDto: AuthUserDto,
    @Response({ passthrough: true }) response,
  ) {
    return this.authService.login(userDto, response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiOperation({
    summary: 'Logout user from account',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout Delete Refresh Token & Cookie',
    headers: {
      setCookie: {
        description: 'Del-Cookie',
        schema: {
          type: 'string',
          example: 'JSESSIONID="" HttpOnly',
        },
      },
    },
  })
  logout(@Req() request: Request, @Response({ passthrough: true }) response) {
    return this.authService.logout(request, response);
  }
}
