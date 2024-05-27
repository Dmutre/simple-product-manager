import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../../database/entities/category.entity';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { User } from '../../database/entities/user.entity';
import { UpdateCategoryDTO } from './dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepoMock: Repository<Category>;

  const mockCategory: Category = {
    id: '1',
    name: 'Test Category',
    createdAt: new Date(),
    user: {} as User,
    products: [],
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    emailApproved: true,
    username: 'TestUser',
    createdAt: new Date(),
    products: [],
    categories: [mockCategory],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockCategory),
            create: jest.fn().mockReturnValue(mockCategory),
            save: jest.fn().mockResolvedValue(mockCategory),
            find: jest.fn().mockResolvedValue([mockCategory]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepoMock = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryData: CreateCategoryDTO = {
      name: 'New Category',
      user: mockUser,
    };

    const result = await service.createCategory(createCategoryData);
    expect(result).toEqual(mockCategory);
    expect(categoryRepoMock.create).toHaveBeenCalledWith(createCategoryData);
    expect(categoryRepoMock.save).toHaveBeenCalledWith(mockCategory);
  });

  it('should get categories by user', async () => {
    const result = await service.getCategories(mockUser);
    expect(result).toEqual([mockCategory]);
    expect(categoryRepoMock.find).toHaveBeenCalledWith({
      where: { user: mockUser },
    });
  });

  it('should get category by id', async () => {
    const result = await service.getCategoryById('1');
    expect(result).toEqual(mockCategory);
    expect(categoryRepoMock.findOneBy).toHaveBeenCalledWith({ id: '1' });
  });

  it('should update a category', async () => {
    const updateCategoryDto: UpdateCategoryDTO = {
      name: 'Updated Category',
    };

    const result = await service.updateCategory('1', updateCategoryDto);
    expect(result.affected).toEqual(1);
    expect(categoryRepoMock.update).toHaveBeenCalledWith(
      { id: '1' },
      updateCategoryDto,
    );
  });

  it('should delete a category', async () => {
    const result = await service.deleteCategory('1');
    expect(result.affected).toEqual(1);
    expect(categoryRepoMock.delete).toHaveBeenCalledWith({ id: '1' });
  });
});
