export enum Role {
  admin = 'admin',
  member = 'member',
}

export enum Status {
  active = 'active',
  readonly = 'readonly',
  blind = 'blind',
}

export interface MemberDB {
  member_id: number;
  username: string;
  password: string;
  nickname: string;
  member_image: null | string;
  role: Role;
  active: Status;
  created_at: Date;
  modified_at: Date;
}
