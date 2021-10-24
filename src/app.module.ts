import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackModule } from './feedback/modules/feedback.module';
import { FeedbackEntity } from './feedback/entities/feedback.entity';
import { UsersModule } from './users/modules/users.module';
import { AuthModule } from './auth/modules/auth.module';
import { UserEntity } from './users/entities/user.entity';
import { VotesModule } from './votes/modules/votes.module';
import { VoteEntity } from './votes/entities/vote.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      username: '',
      password: '',
      database: 'feedback_app',
      entities: [FeedbackEntity, UserEntity, VoteEntity],
      synchronize: true,
    }),
    FeedbackModule,
    UsersModule,
    AuthModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
