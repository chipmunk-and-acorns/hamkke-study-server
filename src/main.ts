import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { pool } from './db/postgres';
import { env } from './util/env';
import indexRoute from './route/index.route';
import client from './db/redis';
import specs from './config/swagger';

const app = express();
const port = env.server.port;

app.use(express.json());
app.use(morgan(env.middleware.morgan));
app.use(
  cors({
    origin: env.middleware.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['location'],
  }),
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', indexRoute);

console.log('trying to connect to server...');
app.listen(port, async () => {
  try {
    console.log('connect server!');
    console.log('trying to connect to database...');
    await pool.query('SELECT NOW();').catch((error) => {
      console.error('DB connection error:', error);
      throw error;
    });
    console.log('connect database!');

    console.log('trying to connect to Redis...');
    await client.connect();
    console.log('connect redis!');
  } catch (error) {
    console.error(error);
    client.disconnect();
    pool.end();
  }
});
