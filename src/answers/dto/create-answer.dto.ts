import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty({ message: '답변 내용은 필수입니다.' })
  @IsString({ message: '답변 내용은 문자열이어야 합니다.' })
  answer: string;

  @IsNotEmpty({ message: '질문 ID는 필수입니다.' })
  @IsInt({ message: '질문 ID는 정수이어야 합니다.' })
  questionId: number;
}
