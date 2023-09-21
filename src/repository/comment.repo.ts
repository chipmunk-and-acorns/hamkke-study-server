import { pool } from '../db/postgresDB';
import { CommentDB, CommentJoinMember } from '../types/database';

type PostCommentData = {
  articleId: number;
  memberId: number;
  parentCommentId?: number;
  content: string;
};

export const saveComment = async (data: PostCommentData) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN TRANSACTION');
    const query =
      'INSERT INTO comment(article_id, member_id, parent_comment_id, content) VALUES ($1, $2, $3, $4) RETURNING *;';
    const values = [data.articleId, data.memberId, data.parentCommentId, data.content];
    const { rows } = await client.query<CommentDB>(query, values);
    await client.query('COMMIT');

    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findCommentsList = async (articleId: number) => {
  const client = await pool.connect();
  try {
    const query = `
    WITH RECURSIVE CommentHierarchy AS (
      -- 최상위 댓글 (부모 댓글이 없는 댓글)
      SELECT
          c.comment_id,
          c.parent_comment_id,
          c.article_id,
          c.content,
          c.created_at,
          c.modified_at,
          c.member_id,
          m.nickname AS member_nickname,  -- 댓글 작성자의 닉네임
          m.role AS member_role,
          m.status AS member_status,
          m.member_image AS member_image,  -- 댓글 작성자의 프로필 이미지 URL
          1 AS depth  -- 댓글의 깊이 (최상위 댓글은 깊이 1)
      FROM "comment" c
      JOIN "member" m ON c.member_id = m.member_id
      WHERE c.article_id = $1 AND c.parent_comment_id IS NULL  -- ?는 article_id로 바인딩
  
      UNION ALL
  
      -- 대댓글
      SELECT
          c.comment_id,
          c.parent_comment_id,
          c.article_id,
          c.content,
          c.created_at,
          c.modified_at,
          c.member_id,
          m.nickname AS member_nickname,  -- 댓글 작성자의 닉네임
          m.role AS member_role,
          m.status AS member_status,
          m.member_image AS member_image,  -- 댓글 작성자의 프로필 이미지 URL
          ch.depth + 1  -- 대댓글의 깊이는 부모 댓글의 깊이 + 1
      FROM "comment" c
      JOIN "member" m ON c.member_id = m.member_id
      JOIN CommentHierarchy ch ON c.parent_comment_id = ch.comment_id
      WHERE c.article_id = $1  -- ?는 article_id로 바인딩
  )
  
  SELECT * FROM CommentHierarchy ORDER BY created_at DESC;
    `;
    const values = [articleId];
    const result = await client.query<CommentJoinMember>(query, values);

    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const findCommentById = async (articleId: number, id: number) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query<CommentJoinMember>(
      'SELECT * FROM comment WHERE article_id = $1 AND id = $2',
      [articleId, id],
    );
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const updateCommentById = async (articleId: number, id: number, content: string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN TRANSACTION');
    const query = 'UPDATE comment SET content = $1 WHERE article_id = $2 AND id = $3 RETURNING *;';
    const values = [content, articleId, id];
    const { rows } = await client.query(query, values);
    await client.query('COMMIT');

    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteCommentById = async (articleId: number, id: number) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN TRANSACTION');
    const query = 'DELETE FROM comment WHERE article_id = $1 AND id = $2 RETURNING *;';
    const values = [articleId, id];
    const { rows } = await client.query(query, values);
    await client.query('COMMIT');

    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
  } finally {
    client.release();
  }
};
