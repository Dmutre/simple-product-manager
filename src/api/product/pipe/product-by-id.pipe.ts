import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { InvalidEntityException } from 'src/utils/exceptions/InvalidEntityException';
import { ProductService } from '../product.service';

@Injectable()
export class ProductByIdPipe implements PipeTransform {
  constructor(private readonly categoryService: ProductService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const product = await this.categoryService.getProductById(value);
    if (!product) throw new InvalidEntityException('Product');
    return product.id;
  }
}
