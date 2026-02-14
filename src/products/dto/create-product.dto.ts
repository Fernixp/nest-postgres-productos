import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
export enum Gender {
  MEN = 'men',
  WOMEN = 'women',
  UNISEX = 'unisex',
}

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  sizes: string[];

  @IsString()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];
}
