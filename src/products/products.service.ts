import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const producto = this.productRepository.create(createProductDto);
      await this.productRepository.save(producto);
      return producto;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  /* Paginar */
  findAll(paginationDto: PaginationDto) {
    const { limit =3, offset =0 } = paginationDto;
    return this.productRepository.findAndCount({
      take: limit,
      skip: offset,
      //!TODO: Relaciones
    });
  }

  async findOne(term: string) {
    let product: Product | null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();

      /* Agregar lowercase para comparar */
      product = await queryBuilder
        .where('LOWER(title) = :title or slug = :slug', {
          slug: term,
          title: term.toLowerCase(),
        })
        .getOne();
    }
    
    if (!product)
      throw new NotFoundException(`Producto no encontrado con term ${term}`);
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productRepository.remove(producto);
    return producto;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Erro inesperado, revisa los logs del servidor..!!',
    );
  }
}
