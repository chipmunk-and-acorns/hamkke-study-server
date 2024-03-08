import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updatedAt: Date;
}
