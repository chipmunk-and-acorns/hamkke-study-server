import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { Module } from '@nestjs/common';
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
} from 'src/const/env-keys.const';

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
      entities: [],
      synchronize: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
