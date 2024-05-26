import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponse {
  @ApiProperty({ description: 'Id of product' })
  id: string;

  @ApiProperty({ description: 'Title of the product' })
  title: string;

  @ApiPropertyOptional({ description: 'Description of the product' })
  description: string;

  @ApiProperty({ description: 'Price of the product' })
  price: number;
}
