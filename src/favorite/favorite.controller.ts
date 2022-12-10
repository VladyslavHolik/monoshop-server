import { Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  toggleFavorite(@Param('id') id: string, @Req() req: AuthRequest) {
    const { user } = req;

    return this.favoriteService.toggleFavorite(Number(id), user.id);
  }
}
