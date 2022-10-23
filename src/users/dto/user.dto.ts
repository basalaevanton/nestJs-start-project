import { ApiProperty } from '@nestjs/swagger';

export class RegistrationUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  readonly email: string;

  @ApiProperty({ example: '12348596', description: 'Пароль' })
  readonly password: string;
}

export class CreateUserDto extends RegistrationUserDto {
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
