import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { CommonModule } from '../common/common.module';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [
    TypeOrmModule.forFeature([Item]), // aqui le seteo la entidad
    CommonModule
  ],
  exports: [
    ItemsService,
    TypeOrmModule
  ]
})
export class ItemsModule {}
