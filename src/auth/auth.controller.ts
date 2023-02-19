import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { getAuthorizationApiHeader } from '@/users/utils/swagger';
import AuthResponseDto from '@/auth/dto/auth-response.dto';
import CreateUserDto from '@/users/dto/create-user.dto';
import LoginDto from '@/users/dto/login.dto';

import { AuthService } from './auth.service';

@ApiTags('auth')
@ApiHeader(getAuthorizationApiHeader())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'creating new user' })
  @ApiResponse({ type: AuthResponseDto })
  @Post('/signup')
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'login existing user' })
  @ApiResponse({ type: AuthResponseDto })
  @Post('/login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
