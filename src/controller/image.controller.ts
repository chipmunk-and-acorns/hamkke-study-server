import { Request, Response } from 'express';
import { v4 } from 'uuid';
import mime from 'mime-types';

import { getPresignedUrl } from '../util/image';

export const presigned = async (request: Request, response: Response) => {
  try {
    const { contentType } = request.query;
    const imageKey = `${v4()}.${mime.extension(contentType as string)}`;
    const key = `raw/${imageKey}`;

    const url = await getPresignedUrl(key);
    return response.status(200).json({ key, presigned: url });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const upload = async (request: Request, response: Response) => {
  const file = request.file;
  return response.status(200).json({ file });
};
