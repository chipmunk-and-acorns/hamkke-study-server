import { pool } from '../db/postgresDB';

export const findCommentsList = async (articleId: number) => {
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM comments WHERE article_id = $1`;
    const values = [articleId];
    const result = await client.query(query, values);

    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
