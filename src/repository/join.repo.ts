import { pool } from '../db/postgresDB';
import { JoinDB } from '../types/database';

export const findJoinByArticleIdAndMemberId = async (articleId: number, memberId: number) => {
  const client = await pool.connect();

  try {
    const query = `SELECT * FROM "join" WHERE article_id = $1 AND member_id = $2`;
    const data = [articleId, memberId];
    const { rows } = await client.query<JoinDB>(query, data);

    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const savaJoin = async (articleId: number, memberId: number) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const query = `INSERT INTO "join" (article_id, member_id) VALUES ($1, $2) RETURNING *`;
    const data = [articleId, memberId];
    const result = await client.query<JoinDB>(query, data);

    await client.query('COMMIT;');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
};
