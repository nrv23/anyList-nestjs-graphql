import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "items" })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({
    nullable: true,
    type: "int"
  }) // sino se setea el tipo en la columna, se infiere por parte del tyorm
  @Field(() => Float, { nullable: true})
  quantity?: number;

  @Column({ nullable: true }) // sino se setea el tipo en la columna, se infiere por parte del tyorm
  @Field(() => String, { nullable: true })
  quantityUnits: string;

  @ManyToOne(() => User, user => user.items, { nullable: false })
  // agregar un indice de busqueda
  @Index('userid_idx')
  @Field(() => User)
  user: User;
}
