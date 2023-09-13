import { pool } from '../db/postgresDB';
import { StackDB } from '../types/database';

export const saveArticleStack = async (articleId: number, stackId: number) => {
  const client = await pool.connect();

  try {
    const result = await client.query<StackDB>(
      'INSERT INTO article_stack (article_id, stack_id) VALUES ($1, $2) RETURNING *',
      [articleId, stackId],
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
