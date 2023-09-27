import { pool } from '../db/postgresDB';
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

export const updateMemberById = async (data: MemberDB) => {
  const { member_id, username, password, nickname, member_image, introduction } = data;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { rows } = await client.query<MemberDB>(
      `UPDATE member SET username=$1, password=$2, nickname=$3, member_image=$4, introduction=$5 WHERE member_id=$6 RETURNING *`,
      [username, password, nickname, member_image, introduction, member_id],
    );
    await client.query('COMMIT');

    return rows;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteMemberById = async (memberId: number) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { rows } = await client.query<MemberDB>(
      `UPDATE member SET is_deleted=true WHERE member_id=$1 RETURNING *`,
      [memberId],
    );
    await client.query('COMMIT');

    return rows;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
