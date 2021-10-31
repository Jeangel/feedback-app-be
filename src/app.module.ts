/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackModule } from './feedback/modules/feedback.module';
import { UsersModule } from './users/modules/users.module';
import { CommentsModule } from './comments/modules/comments.module';
import { AuthModule } from './auth/modules/auth.module';
import { VotesModule } from './votes/modules/votes.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DB_HOST,
  DB_PORT,
  DB_NAME,
} from './config/database/database.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get(DB_HOST);
        const dbPort = configService.get(DB_PORT);
        const dbName = configService.get(DB_NAME);
        return {
          uri: `mongodb://${dbHost}:${dbPort}/${dbName}`,
        };
      },
    }),
    AuthModule,
    UsersModule,
    VotesModule,
    FeedbackModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
