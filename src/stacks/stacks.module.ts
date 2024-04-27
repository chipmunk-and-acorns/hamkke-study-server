import { Module } from '@nestjs/common';
import { StacksService } from './stacks.service';
import { StacksController } from './stacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StacksModel } from './entities/stacks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StacksModel])],
  controllers: [StacksController],
  providers: [StacksService],
})
export class StacksModule {}
