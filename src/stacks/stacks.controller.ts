import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { StacksService } from './stacks.service';

@Controller('stacks')
export class StacksController {
  constructor(private readonly stacksService: StacksService) {}

  @Post()
  async postCreateStack(@Body('name') name: string) {
    return await this.stacksService.createStack(name);
  }

  @Get()
  async getStackAll() {
    return await this.stacksService.getStacks();
  }

  @Delete(':id')
  async deleteStack(@Param('id', ParseIntPipe) id: number) {
    return await this.stacksService.deleteStack(id);
  }
}
