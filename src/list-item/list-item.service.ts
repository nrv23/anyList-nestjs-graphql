import { Injectable } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { ListService } from '../list/list.service';
import { ItemsService } from '../items/items.service';
import { User } from '../users/entities/user.entity';
import { List } from '../list/entities/list.entity';
import { PaginationArgs } from '../common/dtos/args/pagination.args';
import { SearchArgs } from '../common/dtos/args/search.args';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepo: Repository<ListItem>
  ) {

  }

  async create(createListItemInput: CreateListItemInput, user: User): Promise<ListItem> {
    const newListItem = this.listItemRepo.create({
      ...createListItemInput,
      item: { id: createListItemInput.itemId},
      list: { id: createListItemInput.listId}
    });
    // validar si la lista pertenece al usuario actual
    return await this.listItemRepo.save(newListItem);
  }

  findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs):Promise<ListItem[]> {
    
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const queryBuilder = this.listItemRepo.createQueryBuilder('listItem')
      .innerJoin('listItem.item','item')
      .limit(limit)
      .skip(offset)
      .where(`"listId" = :listId`,{ listId: list.id});

      if(search) queryBuilder.andWhere('LOWER(item.name) like :name',{ name: search.toLowerCase()})

      return queryBuilder.getMany();
  }

  async countListItemsByList(list: List) : Promise<number> {
    return this.listItemRepo.count({
      where: {
        list: {
          id: list.id
        }
      }
    })
  }
  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(id: number, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
