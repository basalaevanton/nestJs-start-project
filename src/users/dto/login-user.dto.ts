import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Почтовый адрес',
    required: true,
    uniqueItems: true,
  })
  readonly email: string;

  @ApiProperty({ example: '12348596', description: 'Пароль' })
  readonly password: string;
}
