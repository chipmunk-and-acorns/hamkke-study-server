import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostType } from './const/type.const';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async postCreatePost(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('postType') _postType: PostType,
    @Body('recruitCount') recruitCount: number,
    @Body('deadline') deadline: Date,
  ) {
    return await this.postsService.createPost(
      +userId,
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
  async patchPost(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('postType') postType: PostType,
    @Body('recruitCount') recruitCount: number,
    @Body('deadline') deadline: Date,
  ) {
    return await this.postsService.updatePost(
      +id,
      title,
      content,
      postType,
      recruitCount,
      deadline,
    );
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return await this.postsService.deletePost(+id);
  }
}
