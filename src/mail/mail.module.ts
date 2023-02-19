import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMPT_HOST'),
          secure: true,
          port: config.get('SMPT_PORT'),
          ignoreTLS: true,
          auth: {
            user: config.get('SMPT_USER'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get('FROM_MAIL_NAME')}" <${config.get(
            'MAIL_ADDRESS',
          )}>`,
        },
        // template: {
        //   dir: __dirname + '/templates',
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
