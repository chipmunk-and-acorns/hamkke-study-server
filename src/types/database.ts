// Member
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

// Article
export enum RecruitmentType {
  study = 'study',
  project = 'project',
}
export enum ProgressMode {
  online = 'online',
  offline = 'offline',
}

export interface ArticleDB {
  [key: string]: unknown;
  article_id: number;
  member_id: number;
  title: string;
  content: string;
  recruitment_type: RecruitmentType;
  recruitment_limit: number;
  progress_mode: ProgressMode;
  duration: number;
  closing_date: Date;
  is_closed: boolean;
  view_count: number;
  like_count: number;
  created_at: Date;
  modified_at: Date;
}

export interface ArticleJoinMemberDB extends ArticleDB {
  username: string;
  password: string;
  nickname: string;
  role: Role;
  status: Status;
  member_image: string | null;
  introduction: string;
}
