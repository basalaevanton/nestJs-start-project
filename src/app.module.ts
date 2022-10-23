import { MailService } from './auth/services/mail.service';
import { TokenService } from './auth/services/token.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGODB_USERS, {
      connectionName: 'users',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
