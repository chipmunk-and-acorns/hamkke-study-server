import { BaseModel } from '../../common/entities/base.entity';
import { Entity } from 'typeorm';

@Entity({ name: 'stacks' })
export class StacksModel extends BaseModel {
  name: string;
}
