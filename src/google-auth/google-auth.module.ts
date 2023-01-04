import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
// import { GoogleAuthController } from './google-auth.controller';
// import { GoogleAuthService } from './google-auth.service';

@Module({
  controllers: [],
  providers: [],
  // controllers: [GoogleAuthController],
  // providers: [GoogleAuthService],
  imports: [UserModule],
})
export class GoogleAuthModule {}
