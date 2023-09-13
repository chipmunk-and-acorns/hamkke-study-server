import { pool } from '../db/postgresDB';

export const saveLike = async (articleId: number, memberId: number) => {
  const client = await pool.connect();

  try {
    const query = 'INSERT INTO "like" (article_id, member_id) VALUES ($1, $2) RETURNING *';
    const data = [articleId, memberId];

    const result = await client.query(query, data);

    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findLikeByArticleIdAndMemberId = async (articleId: number, memberId: number) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'SELECT * FROM "like" WHERE article_id = $1 AND member_id = $2',
      [articleId, memberId],
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const deleteLikeByArticleIdAndMemberId = async (articleId: number, memberId: number) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'DELETE FROM "like" WHERE article_id = $1 AND member_id = $2 RETURNING *',
      [articleId, memberId],
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
