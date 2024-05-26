import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty({ description: 'Id of category' })
  id: string;

  @ApiProperty({ description: 'Name of category' })
  name: string;

  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;
}
