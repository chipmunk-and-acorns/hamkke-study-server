import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { AnswersModel } from 'src/answers/entities/answers.entity';

@Entity({ name: 'questions' })
export class QuestionsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  question: string;

  @ManyToOne(() => PostsModel, (post) => post.questions, { nullable: false })
  post: PostsModel;

  @OneToMany(() => AnswersModel, (answer) => answer.question)
  answers: AnswersModel[];
}
