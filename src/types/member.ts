import { Role, Status } from './database';

export interface Member {
  memberId: number;
  username: string;
  password: string;
  nickname: string;
  role: Role;
  Status: Status;
  memberImage: string | null;
  createdAt: Date;
  modifiedAt: Date;
}

export interface PostMember {
  username: string;
  password: string;
  nickname: string;
  memberImage: string | null;
}
