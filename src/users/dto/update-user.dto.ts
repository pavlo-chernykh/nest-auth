import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import CreateUserDto from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsOptional()
  @IsString()
  confirm_email_key?: string;
}
