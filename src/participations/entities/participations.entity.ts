import { Column, Entity, ManyToOne } from 'typeorm';
import { ParticipationsStatus } from '../const/type.const';
import { BaseModel } from '../../common/entities/base.entity';
import { PostsModel } from '../../posts/entities/posts.entity';
import { UsersModel } from '../../users/entities/users.entity';

@Entity({ name: 'participations' })
export class ParticipationsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.participations, {
    nullable: false,
  })
  user: UsersModel;

  @ManyToOne(() => PostsModel, (post) => post.participations, {
    nullable: false,
  })
  post: PostsModel;

  @Column({
    type: 'enum',
    enum: ParticipationsStatus,
    nullable: false,
    default: ParticipationsStatus.APPLY,
  })
  status: ParticipationsStatus = ParticipationsStatus.APPLY;
}