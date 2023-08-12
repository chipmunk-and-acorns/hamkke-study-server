import client from '../db/redis';

export const saveData = async (key: string, data: string, expire?: number) => {
  try {
    await client.set(key, data);

    if (expire) {
      await client.expire(key, expire);
    }
  } catch (error) {
    throw error;
  }
};
