import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: 'DESC',
      },
    });
    return users;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;

      /* TODO: Retornar JWT de acceso */


    } catch (error) {
      this.handleDBException(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: {email:true, password:true} //Solo traemos lo necesario
    }); 
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Credenciales Incorrectas');
    }
    const { password: _, ...userWithoutPassword } = user;
    /* TODO: retornar JWT */
    return user;
  }

  private handleDBException(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    /* FK integridad referencial */
    if (error.code === '23503') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Erro inesperado, revisa los logs del servidor..!!',
    );
  }
}
