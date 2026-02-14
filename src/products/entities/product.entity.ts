import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { ProductImage } from './product-image.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv7(); //Usamos Version 7 de uuid

  @Column({
    type: 'varchar',
    unique: true,
  })
  title: string;

  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  sizes: string[];

  @Column({
    type: 'varchar',
    default: 'unisex',
  })
  gender: string;

  @Column({
    type: 'text',
    array: true,
    default: []
  })
  tags: string[]

  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {
      cascade: true
    }
  )
  images?: ProductImage[];

  @BeforeInsert()
  @BeforeUpdate()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.generateSlug(this.slug);
  }

  private generateSlug(string: string) {
    return string.toLocaleLowerCase().replaceAll(' ', '-').replace("'", '');
  }
}
