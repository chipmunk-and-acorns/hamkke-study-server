import { PickType } from '@nestjs/mapped-types';
import { CommentsModel } from '../entities/comments.entity';
import { IsNumber, IsOptional } from 'class-validator';

type CreateParentCommentAttribute = {
  id: number;
};

export class CreateCommentDto extends PickType(CommentsModel, ['content']) {
  @IsNumber()
  postId: number;

  @IsOptional()
  parent?: CreateParentCommentAttribute;
}
