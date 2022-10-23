import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User {
  @ApiProperty({
    description: 'Почтовый адрес',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'Пароль',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'Аккаунт активирован через почту',
  })
  @Prop({ required: true })
  isActivated: boolean;

  @ApiProperty({
    description: 'Cсылка на активацию',
  })
  activationLink: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
