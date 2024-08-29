import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        private readonly userService: UsersService,
        private readonly itemService: ItemsService
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
        return true;
    }

    async deleteDatabase() {
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
            items.push(this.itemService.create(item, user));
        }

        await Promise.all(items);
    }

}
