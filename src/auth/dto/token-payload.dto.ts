import { IsEmail } from 'class-validator';

export default class TokenPayloadDto {
  @IsEmail()
  readonly email: string;
}
