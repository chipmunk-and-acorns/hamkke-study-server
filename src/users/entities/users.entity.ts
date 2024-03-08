import { Column, Entity } from 'typeorm';
import { UserRole } from '../const/roles.const';
import { BaseModel } from 'src/common/entities/base.entity';

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
  password: string;

  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
  })
  nickname: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;
}
