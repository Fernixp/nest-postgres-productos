import { Product } from "src/products/entities";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v7 as uuidv7 } from 'uuid';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv7(); //Usamos Version 7 de uuid

    @Column({
        type: 'citext',
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        select: false,
    })
    password: string;

    @Column({
        type: 'varchar',
    })
    fullName: string;

    @Column({
        type: 'boolean',
        default: true
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user'],
    })
    roles: string[];

    /* Relacion one to many con products */
    @OneToMany(() => Product, (product) => product.user)
    products: Product[];
}
