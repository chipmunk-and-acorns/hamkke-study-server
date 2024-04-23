import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'stacks' })
export class StacksModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  @IsNotEmpty()
  name: string;
}
