import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegistrationUserDto } from '../users/dto/user.dto';
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
    @Body() userDto: RegistrationUserDto,
    @Response({ passthrough: true }) response,
  ) {
    return this.authService.registration(userDto, response);
  }
}
