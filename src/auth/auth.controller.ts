import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import JwtRefreshGuard from './jwt-refresh.guard';
import { AuthRequest } from './jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() userDto: LoginUserDto, @Req() req, @Res() res) {
    return this.authService.login(userDto, req, res);
  }

  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Get('signout')
  signout(@Req() req: AuthRequest, @Res() res: Response) {
    return this.authService.signout(req, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: AuthRequest) {
    return req.user.id;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: AuthRequest) {
    return this.authService.refresh(request.user.id);
  }
}
