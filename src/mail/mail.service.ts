import { v4 as uuidv4 } from 'uuid';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  HttpException,
  forwardRef,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@/entities/User.entity';
import { UsersService } from '@/users/users.service';
import { emailConfirmRoute, emailConfirmSubject } from './constants';
import mailConfirmTemplate from './templates/mailconfirmation';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async sendEmailConfirm(user: User): Promise<void> {
    try {
      const key = uuidv4();
      this.usersService.updateUserByEmail(user.email, {
        confirm_email_key: key,
      });
      const url = `${
        this.configService.get('CLIENT_URL') + emailConfirmRoute
      }/${key}`;
      await this.sendMail(user, emailConfirmSubject, mailConfirmTemplate(url));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  private async sendMail(
    user: User,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject,
        html,
      });
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
