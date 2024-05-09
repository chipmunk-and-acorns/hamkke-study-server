import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'DESC' as const;

  @IsNumber()
  @IsOptional()
  take?: number = 10;

  @Transform(({ value }) => value.split(',').map((value) => parseInt(value)))
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  @IsOptional()
  positions?: number[] = [];

  @Transform(({ value }) => value.split(',').map((value) => parseInt(value)))
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  @IsOptional()
  stacks?: number[] = [];
}
