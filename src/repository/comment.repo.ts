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

export const findCommentById = async (articleId: number, id: number) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM comment WHERE article_id = $1 AND id = $2', [
      articleId,
      id,
    ]);
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

    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.query('COMMIT');
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

    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
  } finally {
    await client.query('COMMIT');
    client.release();
  }
};
