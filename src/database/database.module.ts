import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConfigurationModule from 'src/config/configuration.module';
import DatabaseConfigService from 'src/config/database-config';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [DatabaseConfigService],
      useFactory: (configService: DatabaseConfigService) => ({
        type: configService.db_type,
        host: configService.db_host,
        port: configService.db_port,
        username: configService.db_user,
        password: configService.db_password,
        database: configService.db_name,
        entities: [User, Token, Product, Category],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
