// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { google, Auth } from 'googleapis';
// import { AuthService } from 'src/auth/auth.service';
// import { UserService } from 'src/user/user.service';
//
// @Injectable()
// export class GoogleAuthService {
//   oauthClient: Auth.OAuth2Client;
//   constructor(
//     private readonly usersService: UserService,
//     private readonly configService: ConfigService,
//     private readonly authenticationService: AuthenticationService
//   ) {
//     const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
//     const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');
//
//     this.oauthClient = new google.auth.OAuth2(
//       clientID,
//       clientSecret
//     );
//   }
//
//   async authenticate(token: string) {
//     const tokenInfo = await this.oauthClient.getTokenInfo(token);
//
//     const email = tokenInfo.email;
//
//     try {
//       const user = await this.userService.getByEmail(email);
//
//       return this.handleRegisteredUser(user);
//     } catch (error) {
//       if (error.status !== 404) {
//         throw new error;
//       }
//
//       return this.registerUser(token, email);
//     }
//   }
//
//   // ...
// }
