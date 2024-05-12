import { BadRequestException, Module, forwardRef } from '@nestjs/common';
import { extname } from 'path';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { MulterModule } from '@nestjs/platform-express';
import { USER_IMAGE_PATH } from 'src/common/const/path.const';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel]),
    forwardRef(() => AuthModule),
    MulterModule.register({
      limits: {
        fileSize: 10485760, // 10MB
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);

        if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다'),
            false,
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (_req, _res, cb) {
          cb(null, USER_IMAGE_PATH);
        },
        filename: function (_req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
