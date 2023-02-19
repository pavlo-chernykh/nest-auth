import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ValidatedUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Pavlo Chernykh' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;
}
