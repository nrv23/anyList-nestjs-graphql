import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CurrentUserDecorator } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { PaginationArgs } from '../common/dtos/args/pagination.args';
import { SearchArgs } from '../common/dtos/args/search.args';
import { Item } from '../items/entities/item.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard) // esto protege las rutas
export class ListResolver {
  constructor(private readonly listService: ListService,
    private readonly listItemService: ListItemService
  ) { }

  @Mutation(() => List)
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUserDecorator([ValidRoles.admin]) user: User
  ) {
    return this.listService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUserDecorator([ValidRoles.admin]) user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArg: SearchArgs
  ) {
    return this.listService.findAll(user, paginationArgs, searchArg);
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserDecorator([ValidRoles.admin]) user: User
  ) {
    return this.listService.findOne(id, user);
  }

  @Mutation(() => List)
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUserDecorator([ValidRoles.admin]) user: User
  ) {
    return this.listService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserDecorator([ValidRoles.admin]) user: User) {
    return this.listService.remove(id, user);
  }


  @ResolveField(() => [ListItem], { name: "items" })
  async getListItems(
    @Parent() list: List, // parent seria la entidad padre, en este caso List
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArg: SearchArgs
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(list, paginationArgs, searchArg);
  }
  @ResolveField(() => Int, { name: "totalItems" })
  async countListItemsByList(
    @Parent() list: List
  ) : Promise<number> {
    return this.listItemService.countListItemsByList(list); 
  }
}
