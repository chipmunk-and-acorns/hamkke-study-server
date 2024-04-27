import { BaseModel } from '../../common/entities/base.entity';
import { QuestionsModel } from '../../questions/entities/questions.entity';
import { UsersModel } from '../..//users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'answers' })
export class AnswersModel extends BaseModel {
  @ManyToOne(() => QuestionsModel, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: QuestionsModel;

  @ManyToOne(() => UsersModel, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UsersModel;

  @Column({
    type: 'text',
    nullable: false,
  })
  answer: string;
}
