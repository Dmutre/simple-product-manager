import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @ApiProperty({ description: 'Name of your category' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
