import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
@Entity({ name: 'products' })
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
      cascade: true,
      /* Cada vez que usemos find* carga sus relaciones autmaticamente */
      eager: true
    }
  )
  images?: ProductImage[];

  /* Relacion one to many con user */
  @ManyToOne(() => User, (user) => user.products, {
    eager: true
  })
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.generateSlug(this.slug);
  }

  /* Registrar el id del usuario al crear un producto */


  private generateSlug(string: string) {
    return string.toLocaleLowerCase().replaceAll(' ', '-').replace("'", '');
  }
}
