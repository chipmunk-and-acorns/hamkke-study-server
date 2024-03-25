import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from '../const/roles.const';
import { BaseModel } from 'src/common/entities/base.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { IsString, Length, ValidationArguments } from 'class-validator';

@Entity({
  name: 'users',
})
export class UsersModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @IsString()
  @Length(8, 20, {
    message: (args: ValidationArguments) => {
      console.log(args);
      return '';
    },
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
  })
  @IsString()
  @Length(1, 12, { message: '닉네임은 1자 이상 12자 이하로 입력해주세요.' })
  nickname: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

  @OneToMany(() => PostsModel, (post) => post.user)
  posts: PostsModel[];
}
