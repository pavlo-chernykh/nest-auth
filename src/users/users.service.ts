import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity';
import SetProfileImageDto from './dto/set-profile-image.dto';
import { FileService } from '@/file/file.service';
import { FileType } from '@/file/types';
import { MailService } from '@/mail/mail.service';
import sendConfirmMailDto from './dto/send-confirm-mail.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<InsertResult> {
    try {
      const userHashed = await this.hashPassword(createUserDto);
      const userData = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([userHashed])
        .execute();

      return userData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async hashPassword(payload: CreateUserDto): Promise<CreateUserDto> {
    try {
      const user = { ...payload };
      if (user.password) {
        const hashedPassword = await bcrypt.hash(
          user.password,
          +this.configService.get('BCRYPT_SALT_ROUNDS'),
        );
        user.password = hashedPassword;
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async sendConfirmMail(dto: sendConfirmMailDto): Promise<void> {
    try {
      const user = await this.findOne({ email: dto.email });
      if (!user) {
        return;
      }
      await this.mailService.sendEmailConfirm(user);
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(
    payload: object,
    hiddenColumns?: string[],
  ): Promise<User | undefined> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .where(payload);
      if (hiddenColumns) {
        hiddenColumns.forEach((column) => {
          query.addSelect(`user.${column}`);
        });
      }

      return await query.getOne();
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async updateUserById(id: number, payload: UpdateUserDto): Promise<void> {
    try {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(payload)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  async updateUserByEmail(
    email: string,
    payload: UpdateUserDto,
  ): Promise<void> {
    try {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(payload)
        .where({ email })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async uploadProfileImageFile(
    file: Express.Multer.File,
    user: User,
  ): Promise<SetProfileImageDto> {
    try {
      const profilePhoto = this.fileService.createFile(FileType.image, file);
      this.fileService.removeFile(user.profile_image);
      await this.updateUserByEmail(user.email, { profile_image: profilePhoto });

      return { profilePhoto };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }
}
