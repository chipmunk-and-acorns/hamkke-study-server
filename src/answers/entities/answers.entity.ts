import { BaseModel } from 'src/common/entities/base.entity';
import { QuestionsModel } from 'src/questions/entities/questions.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'answers' })
export class AnswersModel extends BaseModel {
  @ManyToOne(() => QuestionsModel, (question) => question.answers)
  question: QuestionsModel;

  @ManyToOne(() => UsersModel, (user) => user.answers)
  user: UsersModel;

  @Column({
    type: 'text',
    nullable: false,
  })
  answer: string;
}
