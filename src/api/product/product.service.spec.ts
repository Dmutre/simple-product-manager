import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../database/entities/product.entity';
import { CategoryService } from '../category/category.service';
import { User } from '../../database/entities/user.entity';
import { Category } from '../../database/entities/category.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { InvalidEntityException } from '../../utils/exceptions/InvalidEntityException';

describe('ProductService', () => {
  let service: ProductService;
  let productRepoMock: Repository<Product>;
  let categoryServiceMock: CategoryService;

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

  const mockProduct: Product = {
    id: '1',
    title: 'Test Product',
    description: 'Test Description',
    price: 100,
    createdAt: new Date(),
    user: mockUser,
    category: mockCategory,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn().mockReturnValue(mockProduct),
            save: jest.fn().mockResolvedValue(mockProduct),
            find: jest.fn().mockResolvedValue([mockProduct]),
            findOneBy: jest.fn().mockResolvedValue(mockProduct),
            findOne: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            getCategoryById: jest.fn().mockResolvedValue(mockCategory),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepoMock = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    categoryServiceMock = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDTO = {
      title: 'New Product',
      description: 'New Description',
      price: 200,
      categoryId: '1',
    };

    const result = await service.createProduct(mockUser, createProductDto);
    expect(result).toEqual(mockProduct);
    expect(productRepoMock.create).toHaveBeenCalledWith({
      ...createProductDto,
      user: mockUser,
    });
    expect(productRepoMock.save).toHaveBeenCalledWith(mockProduct);
  });

  it('should get products by user', async () => {
    const result = await service.getProducts(mockUser);
    expect(result).toEqual([mockProduct]);
    expect(productRepoMock.find).toHaveBeenCalledWith({
      where: { user: mockUser },
    });
  });

  it('should get product by id', async () => {
    const result = await service.getProductById('1');
    expect(result).toEqual(mockProduct);
    expect(productRepoMock.findOneBy).toHaveBeenCalledWith({ id: '1' });
  });

  it('should update a product by id', async () => {
    const updateProductDto: UpdateProductDTO = {
      title: 'Updated Product',
      description: 'Updated Description',
      price: 300,
      categoryId: '1',
    };

    const result = await service.updateProductById('1', updateProductDto);
    expect(result).toEqual(undefined);
    expect(productRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['category'],
    });
    expect(productRepoMock.save).toHaveBeenCalledWith(mockProduct);
  });

  it('should delete a product by id', async () => {
    const result = await service.deleteProduct('1');
    expect(result.affected).toEqual(1);
    expect(productRepoMock.delete).toHaveBeenCalledWith({ id: '1' });
  });

  it('should throw InvalidEntityException if category does not exist', async () => {
    jest.spyOn(categoryServiceMock, 'getCategoryById').mockResolvedValue(null);

    const createProductDto: CreateProductDTO = {
      title: 'New Product',
      description: 'New Description',
      price: 200,
      categoryId: 'non-existing-category-id',
    };

    await expect(
      service.createProduct(mockUser, createProductDto),
    ).rejects.toThrow(InvalidEntityException);
  });

  it('should not update category if categoryId is not provided during update', async () => {
    const updateProductDto: UpdateProductDTO = {
      title: 'Updated Product',
      description: 'Updated Description',
      price: 300,
      categoryId: undefined,
    };

    const result = await service.updateProductById('1', updateProductDto);
    expect(result).toEqual(undefined);
    expect(productRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['category'],
    });
    expect(productRepoMock.save).toHaveBeenCalledWith(mockProduct);
  });

  it('should throw InvalidEntityException if category does not exist during update', async () => {
    jest.spyOn(categoryServiceMock, 'getCategoryById').mockResolvedValue(null);

    const updateProductDto: UpdateProductDTO = {
      title: 'Updated Product',
      description: 'Updated Description',
      price: 300,
      categoryId: 'non-existing-category-id',
    };

    await expect(
      service.updateProductById('1', updateProductDto),
    ).rejects.toThrow(InvalidEntityException);
  });
});
