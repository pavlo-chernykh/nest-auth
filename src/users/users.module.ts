import { FileModule } from '@/file/file.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FileModule,
    forwardRef(() => MailModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
