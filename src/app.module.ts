import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { QuestionsModule } from './questions/questions.module';
import { ParticipationsModule } from './participations/participations.module';
import { AnswersModule } from './answers/answers.module';
import { StacksModule } from './stacks/stacks.module';
import { PositionsModule } from './positions/positions.module';
import config from './ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(config),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
    AnswersModule,
    AuthModule,
    CommonModule,
    ParticipationsModule,
    PositionsModule,
    PostsModule,
    QuestionsModule,
    StacksModule,
    UsersModule,
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
