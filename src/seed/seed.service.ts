import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { SEED_ITEMS, SEED_LIST, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { List } from '../list/entities/list.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListService } from '../list/list.service';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<List>,

        @InjectRepository(List)
        private readonly listRepo: Repository<Item>,

        @InjectRepository(ListItem)
        private readonly listItemRepo: Repository<ListItem>,
        //-------------------------
        private readonly userService: UsersService,
        private readonly itemService: ItemsService,
        private readonly listService: ListService,
        private readonly listItemService: ListItemService
    ) {
        this.isProd = this.configService.get("STATE") === "prod";
    }


    async executeSeed() {

        if (this.isProd) {
            throw new BadRequestException("No se puede ejecutar la funcion del seed en un ambiente de producción");
        }
        await this.deleteDatabase();
        const user = await this.loadUsers();
        await this.loadItems(user);
        const list = await this.loadLists(user);
        const items = await this.itemService.findAll(user,{limit: 10, offset: 0},{})
        await this.loadListItems(items, list, user);
        return true;
    }

    async deleteDatabase() {

        await this.listItemRepo.createQueryBuilder()
            .delete()
            .where({})
            .execute();
            
        await this.listRepo.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        await this.itemRepo.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        await this.userRepo.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }


    async loadUsers(): Promise<User> {

        const users = [];
        for (const user of SEED_USERS) {
            users.push(await this.userService.create(user));
        }
        return users[0];
    }

    async loadItems(user: User) {
        const items = [];
        for (const item of SEED_ITEMS) {
            items.push(await this.itemService.create(item, user));
        }

        await Promise.all(items);
    }

    async loadLists(user: User): Promise<List> {
        
        const lists = [];
        for (const item of SEED_LIST) {
            lists.push(await this.listService.create(item, user));
        }
        return lists[0];
    }

    async loadListItems(items: Item[], list: List, user: User) {

        for (const item of items) {
            
            this.listItemService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1) === 0,
                listId: list.id,
                itemId: item.id
            },user)
        }
    }
}
