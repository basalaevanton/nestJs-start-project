import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @ApiProperty({
    example: '12348596',
    description: 'Пароль',
    minLength: 7,
  })
  readonly password: string;
}

export class CreateUserDto extends AuthUserDto {
  @ApiProperty({
    example: 'asdasd-asd12619-asd',
    description: 'часть ссылки активации',
  })
  readonly activationLink: string;
}

export class ResponseCreateUserDto {
  @ApiProperty({
    example: 'asdasdasd12619asd',
    description: 'AccessToken',
  })
  readonly accessToken: string;

  @ApiProperty({
    type: CreateUserDto,
    description: 'CreateUserDto',
  })
  readonly user: CreateUserDto;
}
