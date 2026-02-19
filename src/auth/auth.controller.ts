import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('users')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  /* Implementar guard */
  @Get('private')
  @UseGuards( AuthGuard())
  testingPrivateRoute() {
    return {
      ok: true,
      message: 'This route is private',
    };
  }
}
