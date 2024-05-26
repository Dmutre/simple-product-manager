import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { CategoryResponse } from "./response/category.response";
import { JwtGuard } from "src/security/jwt.guard";
import { CategoryByIdPipe } from "./pipe/category-by-id.pipe";
import { UpdateCategoryDTO } from "./dto/update-category.dto";
import { MessageResponse } from "../auth/response/message.response";

@Controller('category')
@ApiTags('Category')
export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category, that would belong to user' })
  @ApiOkResponse({ type: CategoryResponse })
  createCategory (
    @Req() request,
    @Body() data: CreateCategoryDTO
  ) {
    data.user = request.user;
    return this.categoryService.createCategory(data);
  }
  
  @UseGuards(JwtGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories of user' })
  @ApiOkResponse({ type: [CategoryResponse] })
  getCategories(
    @Req() request
  ) {
    return this.categoryService.getCategories(request.user);
  }

  @UseGuards(JwtGuard)
  @Get('/:categoryId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponse({ type: CategoryResponse })
  getCategoryById(
    @Param('categoryId', CategoryByIdPipe) categoryId: string,
  ) {
    return this.categoryService.getCategoryById(categoryId);
  }

  @UseGuards(JwtGuard)
  @Patch('/:categoryId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category by id' })
  @ApiOkResponse({ type: MessageResponse })
  async updateCategoryById(
    @Param('categoryId', CategoryByIdPipe) categoryId: string,
    @Body() data: UpdateCategoryDTO
  ) {
    await this.categoryService.updateCategory(categoryId, data);
    return { message: 'Category updated' }
  }

  @UseGuards(JwtGuard)
  @Delete('/:categoryId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiOkResponse({ type: MessageResponse })
  async deleteCategoryById(
    @Param('categoryId', CategoryByIdPipe) categoryId: string,
  ) {
    await this.categoryService.deleteCategory(categoryId);
    return { message: 'Category deleted' }
  }
}