import * as redis from 'redis';

import { env } from '../util/env';

const client = redis.createClient({
  socket: {
    host: env.redis.host,
    port: env.redis.port,
  },
});

export default client;
