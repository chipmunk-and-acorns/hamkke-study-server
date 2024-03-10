import { Column, Entity, ManyToOne } from 'typeorm';
import { PostType } from '../const/type.const';
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';

@Entity({
  name: 'posts',
})
export class PostsModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
  })
  postType: PostType;

  @Column({
    type: 'int',
    nullable: false,
  })
  recruitCount: number;

  @Column({
    type: 'date',
    nullable: false,
  })
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

  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  user: UsersModel;
}
