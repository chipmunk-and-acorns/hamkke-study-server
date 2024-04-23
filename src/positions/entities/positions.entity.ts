import { IsNotEmpty } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'positions' })
export class PositionsModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  @IsNotEmpty()
  name: string;
}
