import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsModel]),
    CommonModule,
    AuthModule,
    UsersModule,
    QuestionsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
