import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtGuard } from 'src/security/jwt.guard';
import { ProductResponse } from './response/product.response';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductByIdPipe } from './pipe/product-by-id.pipe';
import { MessageResponse } from '../auth/response/message.response';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('product')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product, that would belong to user' })
  @ApiOkResponse({ type: ProductResponse })
  createProduct(@Req() request, @Body() data: CreateProductDTO) {
    return this.productService.createProduct(request.user, data);
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products of user' })
  @ApiOkResponse({ type: [ProductResponse] })
  getProducts(@Req() request) {
    return this.productService.getProducts(request.user);
  }

  @UseGuards(JwtGuard)
  @Get('/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({ type: ProductResponse })
  getProductById(@Param('productId', ProductByIdPipe) productId: string) {
    return this.productService.getProductById(productId);
  }

  @UseGuards(JwtGuard)
  @Patch('/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product by id' })
  @ApiOkResponse({ type: MessageResponse })
  async updateProductById(
    @Param('productId', ProductByIdPipe) productId: string,
    @Body() data: UpdateProductDTO,
  ) {
    await this.productService.updateProductById(productId, data);
    return { message: 'Product updated' };
  }

  @UseGuards(JwtGuard)
  @Delete('/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product by id' })
  @ApiOkResponse({ type: MessageResponse })
  async deleteProductById(
    @Param('productId', ProductByIdPipe) productId: string,
  ) {
    await this.productService.deleteProduct(productId);
    return { message: 'Product deleted' };
  }
}
