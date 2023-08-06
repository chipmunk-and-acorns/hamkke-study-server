import dotenv from 'dotenv';

dotenv.config();

const required = (key: string, defaultValue?: any) => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error('잘못된 환경변수입니다 : ' + key);
  }

  return value;
};

export const env = {
  server: {
    port: required('SERVER_PORT', 8080),
  },
  redis: {
    host: required('REDIS_HOST'),
    port: required('REDIS_PORT', 6397),
  },
};
