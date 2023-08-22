import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV;
const file = NODE_ENV ? `.env.${NODE_ENV}` : '.env';
dotenv.config({
  path: path.join(__dirname, '..', '..', file),
});

const required = (key: string, defaultValue?: any) => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error('잘못된 환경변수입니다 : ' + key);
  }

  return value;
};

export const env = {
  server: {
    port: Number(required('SERVER_PORT', 8080)),
  },
  middleware: {
    morgan: required('MORGAN'),
    cors: {
      origin: required('CORS_ORIGIN', '*'),
    },
  },
  db: {
    host: required('POSTGRES_HOST'),
    user: required('POSTGRES_USER'),
    secret: required('POSTGRES_PASSWORD'),
    port: required('POSTGRES_PORT'),
    database: required('POSTGRES_DB'),
  },
  redis: {
    host: required('REDIS_HOST'),
    port: Number(required('REDIS_PORT', 6397)),
  },
  auth: {
    jwt: {
      accessKey: required('JWT_ACCESS_KEY'),
      accessExpire: Number(required('JWT_ACCESS_EXPIRE', 3600000)),
      refreshKey: required('JWT_REFRESH_KEY'),
      refreshExpire: Number(required('JWT_REFRESH_EXPIRE', 604800000)),
    },
  },
  aws: {
    s3: {
      access: required('AWS_IMAGE_ACCESS'),
      secret: required('AWS_IMAGE_SECRET'),
      region: required('AWS_IMAGE_REGION'),
      bucket: required('AWS_BUCKET_NAME'),
    },
  },
};
