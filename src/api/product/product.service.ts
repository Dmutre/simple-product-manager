import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { CategoryService } from '../category/category.service';
import { InvalidEntityException } from '../../utils/exceptions/InvalidEntityException';
import { User } from '../../database/entities/user.entity';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(user: User, data: CreateProductDTO) {
    const product = await this.productRepo.create({ ...data, user });
    if (data.categoryId)
      product.category = await this.checkCategoryExistence(data.categoryId);

    return await this.productRepo.save(product);
  }

  private async checkCategoryExistence(categoryId: string) {
    const category = await this.categoryService.getCategoryById(categoryId);
    if (!category) throw new InvalidEntityException('Category');
    return category;
  }

  getProducts(user: User) {
    return this.productRepo.find({ where: { user } });
  }

  getProductById(productId: string) {
    return this.productRepo.findOneBy({ id: productId });
  }

  async updateProductById(productId: string, data: UpdateProductDTO) {
    const existingProduct = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['category'],
    });

    if (data.categoryId) {
      const category = await this.checkCategoryExistence(data.categoryId);
      existingProduct.category = category;
    }

    existingProduct.title =
      data.title !== undefined ? data.title : existingProduct.title;
    existingProduct.description =
      data.description !== undefined
        ? data.description
        : existingProduct.description;
    existingProduct.price =
      data.price !== undefined ? data.price : existingProduct.price;

    await this.productRepo.save(existingProduct);
  }

  async deleteProduct(productId: string) {
    return this.productRepo.delete({ id: productId });
  }
}
