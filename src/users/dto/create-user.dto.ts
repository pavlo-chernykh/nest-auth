import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import {
  passwordMinLength,
  passwordValidationMessage,
  passwordValidationRexExp,
} from '@/users/utils/constants';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Qwerty123' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @MinLength(passwordMinLength)
  @Matches(passwordValidationRexExp, {
    message: passwordValidationMessage,
  })
  password?: string;

  @ApiProperty({ example: 'Pavlo Chernykh' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;
}
