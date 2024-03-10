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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '게시글 작성' })
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

  @ApiOperation({ summary: '게시글 리스트 조회' })
  @Get()
  async getPosts() {
    return await this.postsService.getPosts();
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.postsService.getPostByPostId(+id);
  }

  @ApiOperation({ summary: '게시글 수정' })
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

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deletePost(@User('id') userId: number, @Param('id') id: string) {
    return await this.postsService.deletePost(userId, +id);
  }
}
