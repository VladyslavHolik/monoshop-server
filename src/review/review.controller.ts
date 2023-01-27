import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import { PostReviewDto } from './dto/post-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  postReview(@Req() req: AuthRequest, @Body() dto: PostReviewDto) {
    return this.reviewService.postReview(req.user.id, dto);
  }

  @Get()
  getReviews(
    @Query('userId') userId: number,
    @Query('page') page: number,
    @Query('take') take: number,
  ) {
    return this.reviewService.getUserReviews(userId, page, take);
  }
}
