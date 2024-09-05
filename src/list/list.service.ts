import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dtos/args/pagination.args';
import { SearchArgs } from '../common/dtos/args/search.args';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class ListService {


  constructor(
    @InjectRepository(List)
    private readonly listRepo: Repository<List>
  ) {

  }
  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = this.listRepo.create({
      ...createListInput,
      user
    });
    return await this.listRepo.save(list);
  }

  async findAll(user: User, { limit, offset }: PaginationArgs, { search }: SearchArgs): Promise<List[]> {

    const queryBuilder = this.listRepo.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLocaleLowerCase()}%` })
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepo.findOne({
      where: {
        id,
        user: {
          id: user.id
        }
      }
    });

    if (!list) throw new BadRequestException("Lista no encontrada");
    return list;

  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {

    const list = await this.findOne(id, user);
    const updatedList = await this.listRepo.preload({
      ...list,
      ...updateListInput
    });

    return await this.listRepo.save(updatedList);

  }

  async remove(id: string, user: User): Promise<List> {

    const list = await this.findOne(id, user);
    await this.listRepo.remove(list);

    return {
      ...list, id
    }
  }

  async listsCountByUser(user: User): Promise<number> {
    console.log({ user })

    const count = await this.listRepo.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
    console.log({ count })
    return count;
  }
}
