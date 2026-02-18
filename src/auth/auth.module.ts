import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get('JWT_SECRET');
        const expiresIn = configService.get('JWT_EXPIRES_IN') || '2h';
        console.log('ExpireS: ', expiresIn)
        return {
          secret: secret,
          signOptions: {
            expiresIn: expiresIn
          }
        }
      }
    })
    /*  JwtModule.register({
       secret: process.env.JWT_SECRET,
       signOptions: {
         expiresIn: '2h'
       }
     }) */
  ],
  exports: [TypeOrmModule]
})
export class AuthModule { }
