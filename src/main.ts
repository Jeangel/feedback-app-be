declare const module: any;
import 'reflect-metadata';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      validateCustomDecorators: true,
      transformOptions: {
        strategy: 'exposeAll',
      },
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      strategy: 'exposeAll',
    }),
  );
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.enableCors();
  await app.listen(process.env.SERVER_PORT || 3030);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
