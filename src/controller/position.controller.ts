import { Request, Response } from 'express';
import { findPositionList } from '../repository/position.repo';
import { snakeToCamel } from '../mapper/changeCase.mapper';

export const getPositionList = async (request: Request, response: Response) => {
  try {
    const { rows } = await findPositionList();
    const positions = rows.map((position) => snakeToCamel(position));

    return response.status(200).json(positions);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};
