import { Request, Response } from 'express';

import { findStackList } from '../repository/stack.repo';
import { snakeToCamel } from '../mapper/changeCase.mapper';
import { StackDB } from '../types/database';

export const getStackList = async (request: Request, response: Response) => {
  try {
    const { rows } = await findStackList();
    const stacks = rows.map((stack) => snakeToCamel<StackDB>(stack));

    return response.status(200).json(stacks);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};
