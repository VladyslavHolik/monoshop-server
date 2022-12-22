import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import Role from 'src/auth/role.enum';
import RoleGuard from 'src/auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // getMyUser(@Param('id') id: string) {
  //   return this.userService.getMyUser(Number(id));
  // }
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  editUser(@Req() req: AuthRequest, @Body() dto: EditUserDto) {
    const { user } = req;
    return this.userService.editUser(user.id, dto);
  }
}
