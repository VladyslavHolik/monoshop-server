import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {
    this.nodemailerTransport = createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwt.sign(payload, {
      secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`,
    });
    const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
    return this.nodemailerTransport.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  async confirmEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.userService.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwt.verify(token, {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resendConfirmationLink(userId: number) {
    const user = await this.userService.getUserById(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }
}
