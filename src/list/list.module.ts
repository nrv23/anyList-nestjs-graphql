import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { CommonModule } from '../common/common.module';
import { ListItemModule } from '../list-item/list-item.module';

@Module({
  providers: [ListResolver, ListService],
  imports: [
    TypeOrmModule.forFeature([List]),
    CommonModule,
    ListItemModule
  ],
  exports: [TypeOrmModule, ListService]
})
export class ListModule { }
