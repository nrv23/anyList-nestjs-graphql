import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUserDecorator } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dtos/args/pagination.args';
import { SearchArgs } from '../common/dtos/args/search.args';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard) // esto protege las rutas
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) { }

  @Mutation(() => Item)
  async createItem(
    @CurrentUserDecorator([ValidRoles.admin]) user: User,
    @Args('createItemInput') createItemInput: CreateItemInput
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUserDecorator([ValidRoles.admin]) user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArg: SearchArgs
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs,searchArg);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @CurrentUserDecorator([ValidRoles.admin]) user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  async updateItem(
    @CurrentUserDecorator([ValidRoles.admin]) user: User,
    @Args('updateItemInput') updateItemInput: UpdateItemInput
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => String)
  async removeItem(
    @CurrentUserDecorator([ValidRoles.admin]) user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ) {
    return await this.itemsService.remove(id, user);
  }
}
