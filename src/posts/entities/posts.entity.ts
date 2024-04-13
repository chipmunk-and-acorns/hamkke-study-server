import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { JoinType, PostType } from '../const/type.const';
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { QuestionsModel } from 'src/questions/entities/questions.entity';

@Entity({
  name: 'posts',
})
export class PostsModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @IsString({
    message: 'title은 string 타입을 입력합니다.',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  @IsString({
    message: 'content는 string 타입을 입력합니다.',
  })
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
  })
  @IsEnum(PostType)
  postType: PostType;

  @Column({
    type: 'int',
    nullable: false,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  recruitCount: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  deadline: Date;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isRecruiting: boolean;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  viewCount: number;

  @Column({
    type: 'enum',
    enum: JoinType,
    nullable: false,
    default: JoinType.INSTANT,
  })
  joinType: JoinType;

  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  user: UsersModel;

  @OneToMany(() => QuestionsModel, (question) => question.post, {
    nullable: true,
    cascade: true,
  })
  questions: QuestionsModel[];
}
