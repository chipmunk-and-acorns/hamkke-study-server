import { pool } from '../db/postgresDB';

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
    const { rows } = await client.query(query, values);

    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.query('COMMIT');
    client.release();
  }
};

export const findCommentsList = async (articleId: number) => {
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM comment WHERE article_id = $1`;
    const values = [articleId];
    const result = await client.query(query, values);

    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
