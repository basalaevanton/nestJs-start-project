import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Response,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from '../users/dto/user.dto';
import { AuthService } from './services/auth.service';

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
}
