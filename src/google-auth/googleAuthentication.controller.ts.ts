import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Req,
} from '@nestjs/common';
import { GoogleAuthenticationService } from './googleAuthentication.service';
import { Request } from 'express';
import TokenVerificationDto from './dto/token-verification.dto';

@Controller('google-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}
  @Post()
  async authenticate(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: Request,
  ) {
    const { accessToken, refreshToken, user } =
      await this.googleAuthenticationService.authenticate(tokenData.token);

    return { accessToken, refreshToken };
  }
}
