import client from '../db/redis';

export const findData = async (key: string) => {
  try {
    return await client.get(key);
  } catch (error) {
    throw error;
  }
};

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

export const deleteData = async (key: string) => {
  try {
    return await client.del(key);
  } catch (error) {
    throw error;
  }
};
