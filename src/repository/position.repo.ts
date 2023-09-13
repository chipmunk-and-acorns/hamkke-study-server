import { pool } from '../db/postgresDB';
import { PositionDB } from '../types/database';

export const findPositionList = async () => {
  const client = await pool.connect();

  try {
    const result = await client.query<PositionDB>('SELECT * FROM position');

    return result;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const findPositionListByArticleId = async (articleId: number) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT p.position_id, p.name
      FROM position p
      JOIN article_position ap ON p.position_id = ap.position_id
      WHERE ap.article_id = $1
    `;
    const data = [articleId];
    const result = await client.query<PositionDB>(query, data);

    return result;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
