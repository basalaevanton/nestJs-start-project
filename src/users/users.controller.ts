import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseUserDto } from './dto/response-user.dto';
import { UsersService } from './users.service';
@ApiTags('Пользователи')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Все пользователи',
  })
  @ApiResponse({ status: 200, type: [ResponseUserDto] })
  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    return this.usersService.findAll();
  }
}
