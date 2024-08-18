import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    UsersModule,
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // sino se exporta este modulo configurado, se si se quiere usar en otro modulo se debe 
    // volver a configurar
    JwtModule.registerAsync({// sino se exporta este modulo configurado, se si se quiere usar en otro modulo se debe 
      // volver a configurar
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get("JWT_SECRET"))
        return {
          secret: configService.get("JWT_SECRET"), // se agina el secret key
          signOptions: {
            expiresIn: '6h'
          }
        }
      }
    })
  ],
  exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
