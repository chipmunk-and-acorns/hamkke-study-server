import { pool } from '../db/postgres';
import { MemberDB } from '../types/database';
import { PostMember } from '../types/member';

export const saveMember = async (data: PostMember) => {
  const { username, password, nickname, memberImage } = data;
  const client = await pool.connect();
  const { rows } = await client.query<MemberDB>(
    'INSERT INTO member(username, password, nickname, member_image) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, password, nickname, memberImage],
  );
  client.release();

  return rows;
};

export const findAll = async () => {
  const client = await pool.connect();
  const { rows } = await client.query<MemberDB>(`SELECT * FROM member`);
  client.release();

  return rows;
};

export const findById = async (memberId: number) => {
  const client = await pool.connect();
  const { rows } = await client.query<MemberDB>(`SELECT * FROM member WHERE member_id=$1`, [
    memberId,
  ]);
  client.release();

  return rows;
};

export const findByUsername = async (username: string) => {
  const client = await pool.connect();
  const { rows } = await client.query<MemberDB>('SELECT * FROM member WHERE username=$1;', [
    username,
  ]);
  client.release();

  return rows;
};
