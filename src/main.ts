import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoute from './route/index.route';
import client from './db/redis';
import { pool } from './db/postgres';
import { env } from './util/env';

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

app.get('/', (_request: Request, response: Response) => {
  response.status(200).send('Hello, Hamkke World!');
});

app.use('/api', indexRoute);

app.listen(port, async () => {
  try {
    await pool.query('SELECT NOW();');
    await client.connect();

    console.log('connect server!');
    console.log('connect database!');
    console.log('connect redis!');
  } catch (error) {
    console.error(error);
    client.disconnect();
  }
});
