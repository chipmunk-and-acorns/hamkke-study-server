import { PostsModel } from 'src/posts/entities/posts.entity';
import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksModel } from './entities/bookmark.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarksModel, PostsModel, UsersModel]),
    AuthModule,
    UsersModule,
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
