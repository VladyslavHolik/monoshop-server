import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
  imports: [JwtModule, forwardRef(() => AuthModule), UserModule],
})
export class EmailModule {}
