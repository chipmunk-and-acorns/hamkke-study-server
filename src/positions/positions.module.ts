import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionsModel } from './entities/positions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PositionsModel])],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
