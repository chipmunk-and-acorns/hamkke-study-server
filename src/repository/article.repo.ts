import { pool } from '../db/postgresDB';
import { ArticlePost, ArticleUpdate } from '../types/article';
import { ArticleJoinMemberDB } from '../types/database';

export const saveArticle = async <T extends ArticleJoinMemberDB>(article: ArticlePost) => {
  const client = await pool.connect();

  try {
    const query = `WITH 
        a as (INSERT INTO article(member_id, title, content, recruitment_type, recruitment_limit, progress_mode, duration, closing_date) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *) 
        SELECT 
          a.article_id, a.member_id, a.title, a.content, a.recruitment_type, a.recruitment_limit, a.progress_mode, a.duration, a.closing_date, a.view_count, a.like_count, a.is_closed, a.is_deleted, a.created_at, a.modified_at, m.username, m.password, m.nickname, m.role, m.status, m.member_image, m.introduction, m.is_deleted as destroy
        FROM a
        LEFT JOIN member as m ON a.member_id = m.member_id;`;
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
    await client.query('COMMIT;');

    return rows;
  } catch (error) {
    client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findArticles = async () => {
  const client = await pool.connect();

  try {
    const query = `
    SELECT 
      a.article_id,
      a.title,
      a.content,
      a.recruitment_type,
      a.recruitment_limit,
      a.progress_mode,
      a.duration,
      a.closing_date,
      a.view_count, 
      a.like_count, 
        m.member_id, 
        m.username, 
        m.nickname, 
        m.role, 
        m.status,  
        m.member_image,  
        m.introduction,  
        STRING_AGG(DISTINCT s.name::TEXT,',') AS stacks,
        STRING_AGG(DISTINCT p.name::TEXT,',') AS positions
    FROM article AS a
    JOIN member AS m ON (a.member_id = m.member_id)
    LEFT JOIN article_stack AS asck ON (a.article_id = asck.article_id)
    LEFT JOIN stack AS s ON (asck.stack_id = s.stack_id)
    LEFT JOIN article_position AS aps ON (a.article_id = aps.article_id)
    LEFT JOIN position AS p ON (aps.position_id = p.position_id)
    WHERE NOT a.is_deleted
    GROUP BY 1,m.member_id,m.username,m.nickname,m.role,m.status,m.member_image,m.introduction
    ORDER BY a.created_at DESC;`;
    const { rows } = await client.query<ArticleJoinMemberDB>(query);

    return rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const findArticleById = async (articleId: number) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT
      a.article_id, 
      a.member_id, 
      a.title, 
      a.content, 
      a.recruitment_type, 
      a.recruitment_limit, 
      a.progress_mode, 
      a.duration, 
      a.closing_date, 
      a.view_count, 
      a.like_count, 
      a.is_closed, 
      a.is_deleted, 
      a.created_at, 
      a.modified_at, 
      m.username, 
      m.password, 
      m.nickname, 
      m.role, 
      m.status, 
      m.member_image, 
      m.introduction, 
      m.is_deleted as destroy
      FROM article as a
      LEFT JOIN member as m ON a.member_id = m.member_id 
      WHERE a.article_id = $1`;
    const data = [articleId];
    const { rows } = await client.query<ArticleJoinMemberDB>(query, data);

    return rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const updateArticleById = async (articleId: number, updateArticle: ArticleUpdate) => {
  const client = await pool.connect();

  try {
    const data = Object.entries(updateArticle).reduce((acc, [key, value], idx) => {
      const convertValue = typeof value === 'string' ? `'${value}'` : value;
      return (
        acc + `${key} = ${convertValue}${idx === Object.keys(updateArticle).length - 1 ? '' : ','}`
      );
    }, '');
    const query = `UPDATE article SET ${data} WHERE article_id = $1 RETURNING *`;
    const result = await client.query(query, [articleId]);
    await client.query('COMMIT;');

    return result;
  } catch (error) {
    client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const completeArticleById = async (articleId: number) => {
  const client = await pool.connect();

  try {
    const result = await client.query('UPDATE article SET is_closed = true WHERE article_id = $1', [
      articleId,
    ]);
    await client.query('COMMIT;');

    return result;
  } catch (error) {
    client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteArticleById = async (articleId: number) => {
  const client = await pool.connect();
  try {
    const query = 'UPDATE article SET is_deleted = true WHERE article_id = $1 RETURNING *';
    const data = [articleId];
    const result = await client.query(query, data);
    await client.query('COMMIT;');

    return result;
  } catch (error) {
    client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
