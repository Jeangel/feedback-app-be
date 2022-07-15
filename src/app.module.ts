/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuggestionsModule } from './suggestions/modules/suggestions.module';
import { UsersModule } from './users/modules/users.module';
import { CommentsModule } from './comments/modules/comments.module';
import { AuthModule } from './auth/modules/auth.module';
import { VotesModule } from './votes/modules/votes.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_STRING_SCHEME,
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
        const dbStringScheme = configService.get(DB_STRING_SCHEME);
        const dbHost = configService.get(DB_HOST);
        const dbPort = configService.get(DB_PORT);
        const dbName = configService.get(DB_NAME);
        const dbUsername = configService.get(DB_USERNAME);
        const dbPassword = configService.get(DB_PASSWORD);

        const authentication =
          dbUsername && dbPassword ? `${dbUsername}:${dbPassword}@` : '';
        const port = dbPort ? `:${dbPort}` : '';
        return {
          uri: `${dbStringScheme}://${authentication}${dbHost}${port}/${dbName}`,
        };
      },
    }),
    AuthModule,
    UsersModule,
    VotesModule,
    SuggestionsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
