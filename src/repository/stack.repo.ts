import { pool } from '../db/postgresDB';
import { StackDB } from '../types/database';

export const findStackList = async () => {
  const client = await pool.connect();

  try {
    const result = await client.query<StackDB>('SELECT * FROM stack');
    return result;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const findStackListByArticleId = async (articleId: number) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT s.stack_id, s.name
      FROM stack s
      JOIN article_stack ast ON s.stack_id = ast.stack_id
      WHERE ast.article_id = $1
    `;
    const data = [articleId];
    const result = await client.query<StackDB>(query, data);

    return result;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
