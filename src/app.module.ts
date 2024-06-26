import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';
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
import { CommentsModule } from './comments/comments.module';
import { BookmarkModule } from './bookmarks/bookmark.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: Boolean(process.env.POSTGRES_SYNC),
      migrationsRun: false,
      migrations: [__dirname + '/migrations/data/**/*{.ts,.js}'],
      migrationsTableName: 'src/migrations/log',
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: 6379,
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
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
    CommentsModule,
    BookmarkModule,
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
