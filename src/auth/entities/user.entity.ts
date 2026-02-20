import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v7 as uuidv7 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        if (!this.id) this.id = uuidv7();
        this.email = this.email.toLowerCase().trim();
        this.password = bcrypt.hashSync(this.password, 10);
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        // Solo cifrar si la contraseña ha cambiado o no parece un hash
        if (this.password && !this.password.startsWith('$2b$')) {
            this.password = bcrypt.hashSync(this.password, 10);
        }
        this.email = this.email.toLowerCase().trim();
    }
}
