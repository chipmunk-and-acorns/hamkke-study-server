import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import s3 from '../config/aws';
import { env } from './env';

// s3 presignedURL
export const getPresignedUrl = async (key: string) => {
  const bucketName = env.aws.s3.bucket;

  try {
    const signedUrl = await createPresignedPost(s3, {
      Bucket: bucketName,
      Key: key,
      Fields: {
        key,
      },
      Expires: 60 * 5,
      Conditions: [['content-length-range', 1, 5 * 1024 * 1024]],
    });

    return signedUrl;
  } catch (error) {
    throw error;
  }
};
