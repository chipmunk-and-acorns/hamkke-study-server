import multer from 'multer';
import { v4 } from 'uuid';
import mime from 'mime-types';
import multerS3 from 'multer-s3';

import { env } from '../util/env';
import s3 from '../config/aws';

const storage = multerS3({
  s3,
  bucket: env.aws.s3.bucket,
  key: (request, file, cb) => cb(null, `raw/${v4()}.${mime.extension(file.mimetype)}`),
});
export const upload = multer({
  storage,
  fileFilter: (_request, file, cb) => {
    const type = file.mimetype.split('/')[1];
    if (['jpeg', 'jpg', 'png'].includes(type)) {
      cb(null, true);
    } else {
      cb(new Error('invalid file type'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
