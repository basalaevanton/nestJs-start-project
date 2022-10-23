import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type userTokenDocument = userToken & Document;

@Schema({ collection: 'userStorage' })
export class userToken {
  @ApiProperty({
    description: 'Пользователь',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @ApiProperty({
    description: 'Refresh token',
  })
  @Prop({ required: true })
  refreshToken: string;

  // ip, fingerPrintBrowser, other inf
}

export const userTokenSchema = SchemaFactory.createForClass(userToken);
