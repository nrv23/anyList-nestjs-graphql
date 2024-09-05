import { Module } from '@nestjs/common';
import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { ListModule } from '../list/list.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  providers: [ListItemResolver, ListItemService],
  imports: [
    TypeOrmModule.forFeature([ListItem])
  ],
  exports: [
    ListItemService, TypeOrmModule
  ]
})
export class ListItemModule { }
