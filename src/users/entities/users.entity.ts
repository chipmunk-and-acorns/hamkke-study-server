import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { UserRole } from '../const/roles.const';
import { BaseModel } from 'src/common/entities/base.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';

@Entity({
  name: 'users',
})
export class UsersModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  @IsEmail(null, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @IsString()
  @Length(8, 20, {
    message: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
  })
  @Exclude({ toPlainOnly: true })
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
