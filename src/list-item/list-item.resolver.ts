import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUserDecorator } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) { }

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    // validar si el usuario actual es el dueño de la lista
    @CurrentUserDecorator([ValidRoles.admin, ValidRoles.superUser]) user: User
  ) {
    return this.listItemService.create(createListItemInput, user);
  }

  @Query(() => [ListItem], { name: 'listItem' })
  findAll(
    // validar si el usuario actual es el dueño de la lista
    @CurrentUserDecorator([ValidRoles.admin, ValidRoles.superUser]) user: User
  ) {

    //return this.listItemService.findAll();
  }

  @Query(() => ListItem,{ name: "getListItemById"})
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string
  ): Promise<ListItem> {
    return this.listItemService.findOne(id)
  }

  @Mutation(() => ListItem)
  async updateListItem(
   // validar si el usuario actual es el dueño de la lista
   @CurrentUserDecorator([ValidRoles.admin, ValidRoles.superUser]) user: User,
   @Args('udpateListItemInput') updateListItemInput: UpdateListItemInput
  ): Promise<ListItem>{
    return this.listItemService.update(updateListItemInput.id,updateListItemInput,user)
  }
}
