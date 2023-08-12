export interface Member {
  memberId: number;
  username: string;
  password: string;
  nickname: string;
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
