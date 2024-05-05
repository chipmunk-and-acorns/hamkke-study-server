import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { JoinType, PostType } from '../const/type.const';
import { BaseModel } from '../../common/entities/base.entity';
import { UsersModel } from '../../users/entities/users.entity';
import { QuestionsModel } from '../../questions/entities/questions.entity';
import { ParticipationsModel } from '../../participations/entities/participations.entity';
import { CommentsModel } from '../../comments/entities/comments.entity';
import { StacksModel } from '../../stacks/entities/stacks.entity';
import { PositionsModel } from '../../positions/entities/positions.entity';
import { BookmarksModel } from '../../bookmarks/entities/bookmark.entity';

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
  @IsEnum(JoinType)
  joinType: JoinType;

  @OneToMany(() => QuestionsModel, (question) => question.post, {
    cascade: ['remove', 'update', 'insert'],
  })
  questions?: QuestionsModel[];

  @OneToMany(() => ParticipationsModel, (participation) => participation.post, {
    cascade: ['remove', 'update', 'insert'],
  })
  participations: ParticipationsModel[];

  @OneToMany(() => CommentsModel, (comment) => comment.post, {
    cascade: ['remove', 'update', 'insert'],
  })
  comments: CommentsModel[];

  @OneToMany(() => BookmarksModel, (bookmark) => bookmark.post, {
    cascade: ['remove', 'update', 'insert'],
  })
  bookmarkedBy: BookmarksModel[];

  @ManyToOne(() => UsersModel, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersModel;

  @ManyToMany(() => StacksModel)
  @JoinTable()
  stacks: StacksModel[];

  @ManyToMany(() => PositionsModel)
  @JoinTable()
  positions: PositionsModel[];
}
