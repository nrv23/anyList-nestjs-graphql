import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    /* GraphQLModule.forRoot<ApolloDriverConfig>({
       driver: ApolloDriver,
       // debug: false,
       playground: false,
       autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
       plugins: [ApolloServerPluginLandingPageLocalDefault()],
     }),*/

    //
    // modulos asincronos
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule], // importar modulos
      inject: [JwtService], // inyectar servicios de ese modulo
      useFactory: async (jwtService: JwtService) => ({
        driver: ApolloDriver,
        // debug: false,
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context({ req }) {
          /*
          const token = req.headers.authorization?.replace("Bearer ","");
          if(!token) throw new Error("token needed")
          const payload = jwtService.decode(token);
          if(!payload) throw new Error("Invalid token");
          */
        }
      })
    }),

    // configuracion de typeorm

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //entites: [""],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    CommonModule,
    SeedModule,
    ListModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
