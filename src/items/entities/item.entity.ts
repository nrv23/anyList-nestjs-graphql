import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "items" })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column() // sino se setea el tipo en la columna, se infiere por parte del tyorm
  @Field(() => Float)
  quantity: number;

  @Column({nullable: true}) // sino se setea el tipo en la columna, se infiere por parte del tyorm
  @Field(() => String, {nullable: true})
  quantityUnits: string;

}
