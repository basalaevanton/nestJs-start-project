import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Почта',
    required: true,
    uniqueItems: true,
  })
  readonly email: string;
  @ApiProperty({ example: '12348596', description: 'Пароль' })
  readonly password: string;
}
