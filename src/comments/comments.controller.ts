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
import { CommentsService } from './comments.service';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/random')
  @UseGuards(BearerTokenGuard)
  async postCreateRandomComment(@User('id') userId: number) {
    for (let i = 1; i <= 100; i++) {
      await this.commentsService.createComment(userId, {
        content: `${i}번째 댓글`,
        postId: 1,
      });
    }

    return true;
  }

  @Post()
  @UseGuards(BearerTokenGuard)
  async postCreateComment(
    @User('id') userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsService.createComment(userId, createCommentDto);
  }

  @Get(':id')
  async getComments(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.getComments(id);
  }

  //댓글 수정하기
  @Patch(':id')
  @UseGuards(BearerTokenGuard)
  async patchComment(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return await this.commentsService.updateComment(userId, id, content);
  }

  //댓글 삭제하기
  @Delete(':id')
  @UseGuards(BearerTokenGuard)
  async deleteComment(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.commentsService.deleteComment(userId, id);
  }
}
