import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackModule } from './feedback/modules/feedback.module';
import { FeedbackEntity } from './feedback/entities/feedback.entity';
import { UserController } from './user/controllers/user.controller';
import { UserModule } from './user/modules/user.module';
import { AuthModule } from './auth/modules/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      username: '',
      password: '',
      database: 'feedback_app',
      entities: [FeedbackEntity],
    }),
    FeedbackModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
