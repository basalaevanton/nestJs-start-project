import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from '../../users/dto/response-user.dto';

export class LoginRespDto {
  @ApiProperty({
    example: 'asdasdasd12619asd',
    description: 'AccessToken',
  })
  readonly accessToken: string;

  @ApiProperty({
    type: ResponseUserDto,
    description: 'ResponseUserDto',
  })
  readonly user: ResponseUserDto;
}
