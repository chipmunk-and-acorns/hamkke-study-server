import {
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from './decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getMe(@User() user) {
    return user;
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  async patchUpdateUserInfo() {}

  @Patch('/image')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async patchUploadProfileImage(
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.usersService.uploadImage(userId, file?.filename);
  }
}
