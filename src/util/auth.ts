import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { Role } from '../types/database';

type tokenMappingInformation = {
  memberId: number;
  role: Role;
};

export const hashToPassword = (password: string) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
};

export const compareToPassword = (plainPassword: string, hashPassword: string) => {
  try {
    return bcrypt.compareSync(plainPassword, hashPassword);
  } catch (error) {
    throw error;
  }
};

export const createToken = (data: tokenMappingInformation, key: string, expiresIn: number) => {
  try {
    const token = jwt.sign(data, key, { expiresIn });
    return token;
  } catch (error) {
    throw error;
  }
};
