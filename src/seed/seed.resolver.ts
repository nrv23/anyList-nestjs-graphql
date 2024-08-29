import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean,{name: "executeSeed", description: "cargar datos en la bd"})

  async executeSync(): Promise<boolean> {
    return this.seedService.executeSeed();
  }
} 
