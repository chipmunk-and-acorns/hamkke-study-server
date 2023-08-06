import express from 'express';
import { env } from './util/env';

const app = express();
const port = env.server.port;

app.listen(port, async () => {
  console.log('connect server!');
});
