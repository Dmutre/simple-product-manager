import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/database/entities/category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { User } from "src/database/entities/user.entity";
import { UpdateCategoryDTO } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>
  ) {}

  async createCategory (data: CreateCategoryDTO) {
    const category = await this.categoryRepo.create(data);
    return await this.categoryRepo.save(category);
  }

  getCategories (user: User) {
    return this.categoryRepo.find({ where: { user } });
  }

  getCategoryById(categoryId: string) {
    return this.categoryRepo.findOneBy({ id: categoryId });
  }

  updateCategory(categoryId: string, data: UpdateCategoryDTO) {
    return this.categoryRepo.update({id: categoryId}, data);
  }

  deleteCategory (categoryId: string) {
    return this.categoryRepo.delete({id: categoryId});
  }
}