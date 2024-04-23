import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const data: any = dotenv.parse(fs.readFileSync(`${__dirname}/../.env`));

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: data.POSTGRES_HOST,
  port: parseInt(data.POSTGRES_PORT),
  username: data.POSTGRES_USERNAME,
  password: data.POSTGRES_PASSWORD,
  database: data.POSTGRES_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  logging: true,
  synchronize: true,
  // migrationsRun: false,
  // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  // migrationsTableName: 'src/migrations',
};

export default config;
