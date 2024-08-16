import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {

  }
  async create(createItemInput: CreateItemInput): Promise<Item> {
    
    // crea la instancia de tipo item
    const item = await this.itemRepository.create(createItemInput);
    // guarda en bd
    await this.itemRepository.save(item);
    return item;

  }

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async findOne(id: string) {
    const item = await this.itemRepository.findOneBy({id});
    if(!item) throw new NotFoundException("No se encontró el item");
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {

    const item = await this.findOne(id);
    const updateItem = {
      ...item,
      ...updateItemInput
    }

    //await this.itemRepository.update(id,updateItem);
    await this.itemRepository.save(updateItem);
    return updateItem;

  }

  async remove(id: string): Promise<string>{
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
    return 'Item eliminado';
  }
}
