import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostsModel } from 'src/posts/entities/posts.entity';

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
}
