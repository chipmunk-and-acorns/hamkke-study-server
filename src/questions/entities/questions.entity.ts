import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsModel } from '../../posts/entities/posts.entity';
import { AnswersModel } from '../../answers/entities/answers.entity';

@Entity({ name: 'questions' })
export class QuestionsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  question: string;

  @ManyToOne(() => PostsModel, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostsModel;

  @OneToMany(() => AnswersModel, (answer) => answer.question, {
    cascade: ['remove'],
  })
  answers: AnswersModel[];
}
