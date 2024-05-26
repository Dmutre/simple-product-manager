import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CategoryService } from '../category.service';
import { InvalidEntityException } from 'src/utils/exceptions/InvalidEntityException';

@Injectable()
export class CategoryByIdPipe implements PipeTransform {
  constructor(private readonly categoryService: CategoryService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const category = await this.categoryService.getCategoryById(value);
    if (!category) throw new InvalidEntityException('Category');
    return category.id;
  }
}
