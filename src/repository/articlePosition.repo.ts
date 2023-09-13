import { pool } from '../db/postgresDB';
import { PositionDB } from '../types/database';

export const saveArticlePosition = async (articleId: number, positionId: number) => {
  const client = await pool.connect();

  try {
    const result = await client.query<PositionDB>(
      'INSERT INTO article_position (article_id, position_id) VALUES ($1, $2) RETURNING *',
      [articleId, positionId],
    );
    await client.query('COMMIT;');

    return result;
  } catch (error) {
    client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
