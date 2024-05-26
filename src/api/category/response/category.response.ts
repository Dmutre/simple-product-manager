import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/api/auth/response/user.response";
import { User } from "src/database/entities/user.entity";

export class CategoryResponse {
  @ApiProperty({ description: 'Id of category' })
  id: string;

  @ApiProperty({ description: 'Name of category' })
  name: string;

  @ApiProperty({ description: 'User. Owner' })
  user: UserResponse;

  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;
}