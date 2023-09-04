import camelCaseKeys from 'camelcase-keys';

import { ArticleResponseDto } from '../../types/article';
import {
  ArticleJoinMemberDB,
  ProgressMode,
  RecruitmentType,
  Role,
  Status,
} from '../../types/database';

interface RawData {
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
  username?: string;
  password?: string;
  nickname?: string;
  role?: Role;
  status?: Status;
  member_image?: string | null;
  introduction?: string;
  member: {
    memberId: number;
    nickname: string;
    role: Role;
    status: Status;
    memberImage: string | null;
    introduction: string;
  };
}

export const articleDBToArticleDTO = (article: ArticleJoinMemberDB): ArticleResponseDto => {
  const data = camelCaseKeys(article);
  const articleResponse: RawData = {
    ...data,
    member: {
      memberId: data.memberId,
      nickname: data.nickname,
      role: data.role,
      status: data.status,
      memberImage: data.memberImage,
      introduction: data.introduction,
    },
  };

  delete articleResponse.username;
  delete articleResponse.password;
  delete articleResponse.nickname;
  delete articleResponse.role;
  delete articleResponse.status;
  delete articleResponse.member_image;
  delete articleResponse.introduction;

  return articleResponse;
};
