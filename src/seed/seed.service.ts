import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './productos-data';
import { CreateProductDto } from 'src/products/dto/create-product.dto';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ) { }
  async runSeed() {
    await this.insertNewProducts();
    return `Productos inseridos correctamente`;
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts()

    const products = initialData.products;
    const insertPromises: Promise<any>[] = [];

    /* products.forEach(product => {
      insertPromises.push(this.productsService.create(product as unknown as CreateProductDto));
    }); */

    await Promise.all(insertPromises);
    return true;
  }
}
