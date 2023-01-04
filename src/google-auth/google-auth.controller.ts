// import {
//   Controller,
//   Post,
//   ClassSerializerInterceptor,
//   UseInterceptors,
//   Body,
//   Req,
// } from '@nestjs/common';
// import TokenVerificationDto from './dto/token-verification.dto';
// import { GoogleAuthService } from './google-auth.service';
// import { Request } from 'express';
// @Controller('google-authentication')
// @UseInterceptors(ClassSerializerInterceptor)
// export class GoogleAuthController {
//   constructor(
//     private readonly googleAuthenticationService: GoogleAuthService,
//   ) {}
//   @Post()
//   async authenticate(
//     @Body() tokenData: TokenVerificationDto,
//     @Req() request: Request,
//   ) {
//     const { accessTokenCookie, refreshTokenCookie, user } =
//       await this.googleAuthenticationService.authenticate(tokenData.token);
//     request.res.setHeader('Set-Cookie', [
//       accessTokenCookie,
//       refreshTokenCookie,
//     ]);
//     return user;
//   }
// }
