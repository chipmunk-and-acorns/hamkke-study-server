import express from 'express';
import { env } from './util/env';

const app = express();
const port = env.server.port;

app.listen(port, () => {
  console.log('connect server!');
});
