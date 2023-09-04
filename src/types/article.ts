import { ProgressMode, RecruitmentType, Role, Status } from './database';

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

export interface ArticleResponseDto {
  articleId: number;
  title: string;
  content: string;
  recruitmentType: RecruitmentType;
  recruitmentLimit: number;
  progressMode: ProgressMode;
  duration: number;
  closingDate: Date;
  isClosed: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  modifiedAt: Date;
  member: {
    memberId: number;
    nickname: string;
    role: Role;
    status: Status;
    memberImage: string | null;
    introduction: string;
  };
}
