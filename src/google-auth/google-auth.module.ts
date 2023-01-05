import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { GoogleAuthenticationService } from './googleAuthentication.service';
import { GoogleAuthenticationController } from './googleAuthentication.controller.ts';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GoogleAuthenticationController],
  providers: [GoogleAuthenticationService],
  imports: [UserModule, AuthModule],
})
export class GoogleAuthModule {}
