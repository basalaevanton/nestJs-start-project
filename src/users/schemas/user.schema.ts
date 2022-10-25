import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User {
  @ApiProperty({
    example: '8465asd574846a',
    description: 'ID user',
  })
  _id: string;

  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Почтовый адрес',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: '12345678', description: 'Пароль', minLength: 7 })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'Аккаунт активирован через почту',
  })
  @Prop({ required: true })
  isActivated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
