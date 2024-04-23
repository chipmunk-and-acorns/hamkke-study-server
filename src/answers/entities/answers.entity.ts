import { BaseModel } from '../../common/entities/base.entity';
import { QuestionsModel } from '../../questions/entities/questions.entity';
import { UsersModel } from '../..//users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'answers' })
export class AnswersModel extends BaseModel {
  @ManyToOne(() => QuestionsModel, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: QuestionsModel;

  @ManyToOne(() => UsersModel, (user) => user.answers)
  user: UsersModel;

  @Column({
    type: 'text',
    nullable: false,
  })
  answer: string;
}
