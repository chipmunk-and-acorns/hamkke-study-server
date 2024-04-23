import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'positions' })
export class PositionsModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  @IsNotEmpty()
  name: string;
}
