import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entities/comments.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
  ) {}

  async createComment(userId: number, dto: CreateCommentDto) {
    const comment = this.commentsRepository.create({
      content: dto.content,
      post: {
        id: dto.postId,
      },
      user: {
        id: userId,
      },
    });

    return await this.commentsRepository.save(comment);
  }

  async getComments(id: number) {
    return await this.commentsRepository.find({
      where: { parent: IsNull(), post: { id } },
      relations: ['user', 'children'],
    });
  }

  async updateComment(userId: number, id: number, content: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException(`존재하지 않는 댓글입니다 '${id}'`);
    }

    if (comment.user.id !== userId) {
      throw new UnauthorizedException('수정할 수 있는 권한이 없습니다.');
    }

    comment.content = content;

    return await this.commentsRepository.save(comment);
  }

  async deleteComment(userId: number, id: number) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException(`존재하지 않는 댓글입니다 '${id}'`);
    }

    if (comment.user.id !== userId) {
      throw new UnauthorizedException('삭제할 수 있는 권한이 없습니다.');
    }

    return this.commentsRepository.remove(comment);
  }
}
