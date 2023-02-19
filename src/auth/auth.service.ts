import AuthResponseDto from '@/auth/dto/auth-response.dto';
import CreateUserDto from '@/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import LoginDto from '@/users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<AuthResponseDto> {
    try {
      const user = await this.usersService.findOne({ email: dto.email });

      if (user) {
        throw new BadRequestException('User already exists!');
      }

      await this.usersService.create(dto);

      const payload = { email: dto.email };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async login(user: LoginDto): Promise<AuthResponseDto> {
    try {
      const payload = await this.usersService.findOne({ email: user.email }, [
        'password',
      ]);

      if (!user) {
        throw new BadRequestException('invalid email or password');
      }

      const isPassEquals = await bcrypt.compare(
        user.password,
        payload.password,
      );

      if (!isPassEquals) {
        throw new BadRequestException('invalid email or password');
      }

      const payloadEmail = { email: payload.email };

      return {
        access_token: this.jwtService.sign(payloadEmail),
      };
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
