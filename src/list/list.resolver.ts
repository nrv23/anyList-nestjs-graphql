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

@Resolver(() => List)
@UseGuards(JwtAuthGuard) // esto protege las rutas
export class ListResolver {
  constructor(private readonly listService: ListService) { }

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
}
