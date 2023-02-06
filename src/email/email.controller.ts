import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import ConfirmEmailDto from './confirmEmail.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.emailService.confirmEmail(email);
  }

  // @Post('resend-confirmation-link')
  // @UseGuards(JwtAuthGuard)
  // async resendConfirmationLink(@Req() request: AuthRequest) {
  //   await this.emailService.resendConfirmationLink(request.user.id);
  // }
}
