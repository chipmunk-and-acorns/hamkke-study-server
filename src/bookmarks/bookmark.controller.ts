import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post(':id')
  @UseGuards(BearerTokenGuard)
  async postToggleBookmark(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return await this.bookmarkService.toggleBookmark(userId, postId);
  }

  @Get()
  @UseGuards(BearerTokenGuard)
  async getBookmarkPost(@User('id') userId: number) {
    return await this.bookmarkService.getPostByUser(userId);
  }

  @Get(':id')
  async getBookmarkUser(@Param('id') postId: number) {
    return await this.bookmarkService.getUserByPost(postId);
  }
}
