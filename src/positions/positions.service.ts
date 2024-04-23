import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionsModel } from './entities/positions.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionsModel)
    private readonly positionsRepository: Repository<PositionsModel>,
  ) {}

  async getPositions() {
    return this.positionsRepository.find();
  }
}
