import { join } from 'path';

//
export const PROJECT_ROOT_PATH = process.cwd();
export const PUBLIC_FOLDER_NAME = 'public';
export const USER_FOLDER_NAME = 'users';

//
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);
export const USER_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, USER_FOLDER_NAME);

export const USER_PUBLIC_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  USER_FOLDER_NAME,
);
