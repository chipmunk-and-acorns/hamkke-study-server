import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post-dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '게시글 작성' })
  @Post()
  @UseGuards(AccessTokenGuard)
  async postCreatePost(
    @User('id') userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.createPost(userId, createPostDto);
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.updatePost(userId, id, updatePostDto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deletePost(@User('id') userId: number, @Param('id') id: string) {
    return await this.postsService.deletePost(userId, +id);
  }
}
