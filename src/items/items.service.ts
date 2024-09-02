import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dtos/args/pagination.args';
import { SearchArgs } from '../common/dtos/args/search.args';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {

  }
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {

    // crea la instancia de tipo item
    const item = await this.itemRepository.create({ ...createItemInput, user });
    // guarda en bd
    await this.itemRepository.save(item);
    return item;

  }

  async findAll(user: User, { limit, offset }: PaginationArgs, { search }: SearchArgs): Promise<Item[]> {
    console.log({
      limit, offset 
    })
    /*return await this.itemRepository.find({
      where: {
        user,
        name: Like(`%${search}%`)
      },
      relations: {
        user: true
      }, 
      take: limit,
      skip: offset,
    }); */

    const queryBuilder = this.itemRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`,{ userId: user.id});

      if(search) {
        queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLocaleLowerCase()}%` })
      }

      return queryBuilder.getMany();
  }

  async findOne(id: string, user: User) {
    const item = await this.itemRepository.findOne({
      where: {
        id,
        user
      },
      relations: {
        user: true
      }
    });
    if (!item) throw new NotFoundException("No se encontró el item");
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {

    const item = await this.findOne(id, user);
    const updateItem = {
      ...item,
      ...updateItemInput
    }

    //await this.itemRepository.update(id,updateItem);
    await this.itemRepository.save(updateItem);
    return updateItem;

  }

  async remove(id: string, user: User): Promise<string> {
    const item = await this.findOne(id, user);
    await this.itemRepository.remove(item);
    return 'Item eliminado';
  }

  async itemCountByUser(user: User): Promise<number> {

    return await this.itemRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    })
  }
}
