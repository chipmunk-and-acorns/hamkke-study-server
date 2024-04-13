import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { ParticipationsStatus } from '../const/type.const';

@Entity({ name: 'participations' })
export class ParticipationsModel {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @Column({
    type: 'enum',
    enum: ParticipationsStatus,
    nullable: false,
    default: ParticipationsStatus.APPLY,
  })
  status: ParticipationsStatus = ParticipationsStatus.APPLY;

  @CreateDateColumn()
  createdAt: Date;
}
