import { ArticleResponseDto } from '../types/article';
import {
  ArticleJoinMemberDB,
  ProgressMode,
  RecruitmentType,
  Role,
  Status,
} from '../types/database';
import { snakeToCamel } from './changeCase.mapper';

interface RawData {
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
  memberId?: number;
  username?: string;
  password?: string;
  nickname?: string;
  role?: Role;
  status?: Status;
  memberImage?: string | null;
  introduction?: string;
  destroy?: boolean;
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

export const articleDBToArticleResponseDto = (article: ArticleJoinMemberDB): ArticleResponseDto => {
  const data = snakeToCamel<ArticleJoinMemberDB>(article);
  const articleResponse: RawData = {
    ...data,
    member: {
      memberId: data.memberId,
      nickname: data.nickname,
      role: data.role,
      status: data.status,
      memberImage: data.memberImage,
      introduction: data.introduction,
      isDeleted: data.destroy,
    },
  };

  delete articleResponse.memberId;
  delete articleResponse.username;
  delete articleResponse.password;
  delete articleResponse.nickname;
  delete articleResponse.role;
  delete articleResponse.status;
  delete articleResponse.memberImage;
  delete articleResponse.introduction;
  delete articleResponse.destroy;

  return articleResponse;
};
