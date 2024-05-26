import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/database/entities/user.entity";

export class CreateCategoryDTO {
  @ApiProperty({ description: 'Name of your category' })
  @IsString()
  @IsNotEmpty()
  name: string;

  user: User;
}