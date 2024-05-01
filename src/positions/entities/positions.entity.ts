import { Column, Entity, ManyToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../common/entities/base.entity';
import { PostsModel } from '../../posts/entities/posts.entity';

@Entity({ name: 'positions' })
export class PositionsModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => PostsModel)
  posts: PostsModel[];
}
