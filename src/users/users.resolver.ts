import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUserDecorator } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/entities/item.entity';
import { PaginationArgs } from '../common/dtos/args/pagination.args';
import { SearchArgs } from '../common/dtos/args/search.args';
import { ListService } from '../list/list.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard) // valida que esté logueado
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listsService: ListService
  ) { }



  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUserDecorator([ValidRoles.admin]) user: User // validar el rol del usuario
  ): Promise<User[]> {

    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'findOne' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserDecorator([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUserDecorator([ValidRoles.admin]) user: User) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: "blockUser" })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserDecorator([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.blockUser(id, user);
  }

  @ResolveField(() => Int,{ name: "itemCount" }) // agregar un nuevo en un esquema
  async itemCount(
    @Parent() user: User
  ) : Promise<number>{
    return this.itemService.itemCountByUser(user);
  }

  @ResolveField(() => Int, { name: "listsCount" }) // agregar un nuevo en un esquema
  async listsCount(
    @Parent() user: User
  ): Promise<number> {
    return this.listsService.listsCountByUser(user);
  }

  @ResolveField(() => [Item],{ name: "items" }) // agregar un nuevo en un esquema
  async items(
    @CurrentUserDecorator([ValidRoles.admin]) _: User, // se usa el simbolo _ para indicar que un 
    // parametro no se usa.
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArg: SearchArgs
  ) : Promise<Item[]>{
    return this.itemService.findAll(user, paginationArgs, searchArg);
  }
}
