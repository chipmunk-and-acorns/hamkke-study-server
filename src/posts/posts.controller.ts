import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostType } from './const/type.const';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async postCreatePost(
    @User('id') userId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('postType') _postType: PostType,
    @Body('recruitCount') recruitCount: number,
    @Body('deadline') deadline: Date,
  ) {
    return await this.postsService.createPost(
      userId,
      title,
      content,
      PostType.STUDY,
      recruitCount,
      deadline,
    );
  }

  @Get()
  async getPosts() {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.postsService.getPostByPostId(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async patchPost(
    @User('id') userId: number,
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('postType') postType: PostType,
    @Body('recruitCount') recruitCount: number,
    @Body('deadline') deadline: Date,
  ) {
    return await this.postsService.updatePost(
      userId,
      +id,
      title,
      content,
      postType,
      recruitCount,
      deadline,
    );
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deletePost(@User('id') userId: number, @Param('id') id: string) {
    return await this.postsService.deletePost(userId, +id);
  }
}
