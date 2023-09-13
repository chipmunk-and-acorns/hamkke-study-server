import { ProgressMode, RecruitmentType, Role, Status } from './database';

export enum PlusOrMinus {
  PLUS = '+',
  MINUS = '-',
}
export interface ArticlePost {
  title: string;
  content: string;
  recruitmentType: RecruitmentType;
  recruitmentLimit: number;
  progressMode: ProgressMode;
  duration: number;
  closingDate: Date;
  memberId: number;
}

export interface ArticleUpdate {
  title: string;
  content: string;
  recruitment_type: RecruitmentType;
  recruitment_limit: number;
  progress_mode: ProgressMode;
  duration: number;
  closing_date: Date;
}

export interface ArticleResponseDto {
  articleId: number;
  title: string;
  content: string;
  recruitmentType: RecruitmentType;
  recruitmentLimit: number;
  progressMode: ProgressMode;
  duration: number;
  closingDate: Date;
  viewCount: number;
  likeCount: number;
  isClosed: boolean;
  isDeleted: boolean;
  createdAt: Date;
  modifiedAt: Date;
  member: {
    memberId: number;
    nickname: string;
    role: Role;
    status: Status;
    memberImage: string | null;
    introduction: string;
    isDeleted: boolean;
  };
}
