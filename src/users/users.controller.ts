import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { getAuthorizationApiHeader } from '@/users/utils/swagger';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './utils/decorators/roles.decorator';
import { Role } from './utils/enums/enums';
import { User } from '@/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import SetProfileImageDto from './dto/set-profile-image.dto';
import sendConfirmMailDto from './dto/send-confirm-mail.dto';

@ApiTags('users')
@ApiHeader(getAuthorizationApiHeader())
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'create user' })
  @Post('create')
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'set profile image for user' })
  @ApiResponse({ type: SetProfileImageDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiHeader(getAuthorizationApiHeader())
  @HttpCode(HttpStatus.OK)
  @Post('profileimage')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfileImageFile(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SetProfileImageDto> {
    return this.usersService.uploadProfileImageFile(file, req.user);
  }

  @ApiOperation({ summary: 'send mail for email confirmation' })
  @Post('emailconfirmrequest')
  @HttpCode(HttpStatus.OK)
  passwordResetRequest(@Body() dto: sendConfirmMailDto): Promise<void> {
    return this.usersService.sendConfirmMail(dto);
  }

  @ApiOperation({ summary: 'get current user' })
  @HttpCode(HttpStatus.OK)
  @Get('')
  findOne(@Request() req): User {
    return req.user;
  }

  @ApiOperation({ summary: 'update user by id' })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'update user by id' })
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put('')
  updateUserByEmail(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserByEmail(req.user.email, updateUserDto);
  }
}
