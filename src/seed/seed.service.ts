import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './productos-data';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }
  async runSeed() {
    await this.deleteTables();
    const superadmin = await this.insertUsers();
    await this.insertNewProducts(superadmin);
    return `Productos inseridos correctamente`;
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    await this.userRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUSers = initialData.users;
    const users: User[] = [];
    seedUSers.forEach(user => {
      users.push(this.userRepository.create(user));
    });
    await this.userRepository.save(users);
    return users[0];
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products;
    const insertPromises: Promise<any>[] = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product as unknown as CreateProductDto, user));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
