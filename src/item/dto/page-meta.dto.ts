import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class PageMetaDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  // @IsNumber()
  // @IsNotEmpty()
  // pageCount: number;

  // @IsBoolean()
  // @IsNotEmpty()
  // hasNextPage: boolean;
}

//   "page": 1,
//     "take": 10,
//     "itemCount": 12,
//     "pageCount": 2,
//     "hasPreviousPage": false,
//     "hasNextPage": true
