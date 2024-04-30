import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../common/entities/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { PostsModel } from 'src/posts/entities/posts.entity';

@Entity({ name: 'stacks' })
export class StacksModel extends BaseModel {
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
