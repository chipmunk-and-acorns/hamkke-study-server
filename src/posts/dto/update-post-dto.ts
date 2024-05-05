import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { JoinType, PostType } from '../const/type.const';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(PostType)
  @IsOptional()
  postType?: PostType;

  @IsNumber()
  @IsOptional()
  recruitCount?: number;

  @IsDate()
  @IsOptional()
  deadline?: Date;

  @IsEnum(JoinType)
  @IsOptional()
  joinType?: JoinType;

  @IsNumber({}, { each: true })
  @IsOptional()
  positions?: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  stacks?: number[];

  @IsString({ each: true })
  @IsOptional()
  questions?: string[];
}
