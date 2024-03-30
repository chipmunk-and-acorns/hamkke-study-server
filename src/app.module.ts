import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ENV_POSTGRES_DATABASE_KEY,
  ENV_POSTGRES_HOST_KEY,
  ENV_POSTGRES_PASSWORD_KEY,
  ENV_POSTGRES_PORT_KEY,
  ENV_POSTGRES_USERNAME_KEY,
} from 'src/common/const/env-keys.const';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { PostsModule } from './posts/posts.module';
import { PostsModel } from './posts/entities/posts.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionsModel } from './questions/entities/question.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_POSTGRES_HOST_KEY],
      port: parseInt(process.env[ENV_POSTGRES_PORT_KEY]),
      username: process.env[ENV_POSTGRES_USERNAME_KEY],
      password: process.env[ENV_POSTGRES_PASSWORD_KEY],
      database: process.env[ENV_POSTGRES_DATABASE_KEY],
      entities: [UsersModel, PostsModel, QuestionsModel],
      synchronize: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    PostsModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
