import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonModule } from 'src/common/common.module';
import { ItemsModule } from '../items/items.module';
import { ListModule } from '../list/list.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule,
    ItemsModule,
    ListModule
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
