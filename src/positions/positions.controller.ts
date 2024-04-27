import { Controller, Get, Post } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async postCreatePosition() {}

  @Get()
  async getPositions() {
    return await this.positionsService.getPositions();
  }
}
