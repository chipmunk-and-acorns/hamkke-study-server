import express, { Request, Response } from 'express';

import { env } from './util/env';
import client from './config/redis';

const app = express();
const port = env.server.port;

app.use(express.json());

app.get('/', (_request: Request, response: Response) => {
  response.status(200).send('Hello, Hamkke World!');
});

app.listen(port, async () => {
  try {
    await client.connect();

    console.log('connect server!');
    console.log('connect redis!');
  } catch (error) {
    console.error(error);
    client.disconnect();
  }
});
