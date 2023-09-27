import { pool } from '../db/postgresDB';
import { JoinDB } from '../types/database';

export const findTotalJoinAndAcceptJoinByArticleId = async (articleId: number) => {
  const client = await pool.connect();

  try {
    const query = `
    SELECT COUNT(*) 
    FROM "join" 
    WHERE article_id = $1
    UNION ALL
    SELECT COUNT(*)
    FROM "join"
    WHERE article_id = $1 AND status = 'accept'
    `;
    const data = [articleId];
    const { rows } = await client.query(query, data);

    return [rows[0], rows[1]];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

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

export const acceptOrRejectJoinByJoinId = async (joinId: number, status: string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const query = `UPDATE "join" SET status = $1 WHERE join_id = $2 RETURNING *`;
    const data = [status, joinId];
    const result = await client.query<JoinDB>(query, data);

    await client.query('COMMIT;');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
};
