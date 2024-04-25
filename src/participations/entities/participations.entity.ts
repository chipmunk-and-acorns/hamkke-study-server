import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ParticipationsStatus } from '../const/type.const';
import { BaseModel } from '../../common/entities/base.entity';
import { PostsModel } from '../../posts/entities/posts.entity';
import { UsersModel } from '../../users/entities/users.entity';

@Entity({ name: 'participations' })
export class ParticipationsModel extends BaseModel {
  @ManyToOne(() => UsersModel, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersModel;

  @ManyToOne(() => PostsModel, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostsModel;

  @Column({
    type: 'enum',
    enum: ParticipationsStatus,
    nullable: false,
    default: ParticipationsStatus.APPLY,
  })
  status: ParticipationsStatus = ParticipationsStatus.APPLY;
}
