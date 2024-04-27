import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../common/entities/base.entity';
import { PostsModel } from '../../posts/entities/posts.entity';
import { UsersModel } from '../../users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'comments' })
export class CommentsModel extends BaseModel {
  @Column({
    type: 'text',
    nullable: false,
  })
  @IsNotEmpty()
  content: string;

  @OneToMany(() => CommentsModel, (comment) => comment.parent, {
    cascade: ['remove'],
  })
  children: CommentsModel[];

  @ManyToOne(() => UsersModel, (user) => user.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersModel;

  @ManyToOne(() => PostsModel, (post) => post.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostsModel;

  @ManyToOne(() => CommentsModel, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_comment_id' })
  parent: CommentsModel;
}
