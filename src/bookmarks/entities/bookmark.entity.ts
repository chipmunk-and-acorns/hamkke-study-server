import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { UsersModel } from '../../users/entities/users.entity';
import { PostsModel } from '../../posts/entities/posts.entity';

@Entity({ name: 'bookmars' })
export class BookmarksModel extends BaseModel {
  @ManyToOne(() => UsersModel, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: UsersModel;

  @ManyToOne(() => PostsModel, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'postId' })
  post: PostsModel;
}
