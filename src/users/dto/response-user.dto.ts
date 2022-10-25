import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/schemas/user.schema';

export class ResponseUserDto extends OmitType(User, ['password'] as const) {
  constructor(model: User) {
    super();

    this.email = model.email;
    this._id = model._id;
    this.isActivated = model.isActivated;
  }
}
