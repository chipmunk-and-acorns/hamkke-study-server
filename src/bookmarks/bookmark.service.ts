import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarksModel } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookmarksModel)
    private readonly bookmarksRepository: Repository<BookmarksModel>,
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async toggleBookmark(userId: number, postId: number) {
    const bookmark = await this.bookmarksRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    const status = { status: 'added' };

    if (bookmark) {
      await this.bookmarksRepository.remove(bookmark);
      status.status = 'removed';
    } else {
      const newBookmark = this.bookmarksRepository.create({
        user: { id: userId },
        post: { id: postId },
      });
      await this.bookmarksRepository.save(newBookmark);
    }

    return status;
  }

  async getPostByUser(userId: number) {
    return await this.postsRepository
      .createQueryBuilder('posts')
      .innerJoin('posts.bookmarkedBy', 'bookmarks')
      .where('bookmarks.userId = :userId', { userId })
      .getMany();
  }

  async getUserByPost(postId: number) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .innerJoin('users.bookmarks', 'bookmarks')
      .where('bookmarks.postId = :postId', { postId })
      .getMany();
  }
}
