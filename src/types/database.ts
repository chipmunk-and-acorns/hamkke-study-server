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
  introduction: string;
  role: Role;
  status: Status;
  is_deleted: boolean;
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
  view_count: number;
  like_count: number;
  is_closed: boolean;
  is_deleted: boolean;
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
  destroy: boolean;
}

// Comment
export interface CommentDB {
  comment_id: number;
  article_id: number;
  member_id: number;
  parent_comment_id?: number;
  content: string;
  created_at: Date;
  modified_at: Date;
}

export interface CommentJoinMember extends CommentDB {
  nickname: string;
  role: Role;
  status: Status;
  member_image: string | null;
}

// Stack
export interface StackDB {
  stack_id: number;
  name: string;
  created_at: Date;
  modified_at: Date;
}

export interface PositionDB {
  position_id: number;
  name: string;
  created_at: Date;
  modified_at: Date;
}
