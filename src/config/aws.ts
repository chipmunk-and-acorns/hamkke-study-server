import { S3Client } from '@aws-sdk/client-s3';

import { env } from '../util/env';

const s3 = new S3Client({
  region: env.aws.s3.region,
  credentials: {
    accessKeyId: env.aws.s3.access,
    secretAccessKey: env.aws.s3.secret,
  },
});

export default s3;
