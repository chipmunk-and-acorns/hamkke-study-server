import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { AnswersModel } from './src/answers/entities/answers.entity';
import { ParticipationsModel } from './src/participations/entities/participations.entity';
import { PositionsModel } from './src/positions/entities/positions.entity';
import { PostsModel } from './src/posts/entities/posts.entity';
import { QuestionsModel } from './src/questions/entities/questions.entity';
import { StacksModel } from './src/stacks/entities/stacks.entity';
import { UsersModel } from './src/users/entities/users.entity';
import { CommentsModel } from './src/comments/entities/comments.entity';
import { BookmarksModel } from './src/bookmarks/entities/bookmark.entity';

dotenv.config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  username: configService.getOrThrow('POSTGRES_USERNAME'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  database: configService.getOrThrow('POSTGRES_DATABASE'),
  entities: [
    PostsModel,
    UsersModel,
    ParticipationsModel,
    PositionsModel,
    QuestionsModel,
    AnswersModel,
    StacksModel,
    CommentsModel,
    BookmarksModel,
  ],
  migrations: [__dirname + '/migrations/**'],
});
