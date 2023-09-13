import { Pool } from 'pg';
import { env } from '../util/env';

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.secret,
  database: env.db.database,
});
