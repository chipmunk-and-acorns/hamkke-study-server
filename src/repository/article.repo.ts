import { pool } from '../db/postgres';
import { ArticlePost } from '../types/article';
import { ArticleJoinMemberDB } from '../types/database';

export const saveArticle = async <T extends ArticleJoinMemberDB>(article: ArticlePost) => {
  const client = await pool.connect();
  const query =
    'WITH inserted_article as (INSERT INTO article(member_id, title, content, recruitment_type, recruitment_limit, progress_mode, duration, closing_date) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *) SELECT * FROM inserted_article LEFT JOIN member ON inserted_article.member_id = member.member_id;';
  const data = [
    article.memberId,
    article.title,
    article.content,
    article.recruitmentType,
    article.recruitmentLimit,
    article.progressMode,
    article.duration,
    article.closingDate,
  ];
  const { rows } = await client.query<T>(query, data);
  client.release();

  return rows;
};
export const findArticles = async () => {};
export const findArticleById = async (articleId: number) => {};
export const updateArticleById = async (articleId: number) => {};
export const completeArticleById = async (articleId: number) => {};
export const deleteArticleById = async (articleId: number) => {};
