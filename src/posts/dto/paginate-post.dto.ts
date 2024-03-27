import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  @IsNumber()
  @IsOptional()
  where__id_less_than?: number;

  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'DESC' as const;

  @IsNumber()
  @IsOptional()
  take: number = 10;
}
