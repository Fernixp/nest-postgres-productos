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
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      /* Aca separamos las imagenes de los detalles */
      const { images = [], ...productDetails } = createProductDto;
      const producto = this.productRepository.create({
        /* Mandamos la data sin imagenes */
        ...productDetails,
        /* Hacemos insersion de las imagenes Tabla ProductImage */
        images: images.map(image => this.productImageRepository.create({ url: image })),
      });
      await this.productRepository.save(producto);

      /* Devolvemos solo lo necesario, es decir solo urls, que mando el fe */
      return { ...producto, images: images };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  /* Paginar */
  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: 'DESC',
      },
      /* No noecesario cuando configuramos eager:true en la entity */
      relations: {
        images: true,
      },
      /* Devolvemos solo url, mas no el id de la imagen */
      select: {
        images: {
          id: true,
          url: true,
          /* Demas columnas como createdAt que no necesitamos */
        }
      }
    });
    /* Desestructuramos solo imagenes */
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images?.map(img => img.url)
    })
    );
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Producto no encontrado con id ${id}`);
    return product;
  }

  async findOnePlain(id: string) {

    const { images = [], ...rest } = await this.findOne(id);
    return {
      ...rest,
      images: images.map(img => img.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {


    const { images, ...toUpdate } = updateProductDto;

    /* Buscar un producto por el id y cargamos todas las propiedades que llega del usuario */
    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
    })
    if (!product) throw new NotFoundException(`Producto no encontrado con id ${id}`);

    //Create query runner (Transaccion)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); //conectamos db    
    await queryRunner.startTransaction();

    try {
      if (images) {
        /* Borramos todas las imagenes asociadas al producto */
        await queryRunner.manager.delete(ProductImage,
          { product: { id } }
        )
        /* guardamos las nuevas imagenes que nos llega */
        product.images = images.map(image => this.productImageRepository.create({ url: image }))
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    try {
      await this.productRepository.remove(producto);
      return 'Producto eliminado exitosamente...! id:' + id;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    /* FK integridad referencial */
    if (error.code === '23503') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Erro inesperado, revisa los logs del servidor..!!',
    );
  }
}
