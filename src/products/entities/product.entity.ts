import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v7 as uuidv7 } from 'uuid';
@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv7(); //Usamos Version 7 de uuid

    @Column('varchar',{
        unique: true,
    })
    title: string;


    /* @Column('decimal', {
        precision: 10,
        scale: 2,
    })
    price: number;

    @Column('text')
    description: string;

    @Column('varchar')
    image: string; */
}
