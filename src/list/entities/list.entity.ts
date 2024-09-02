import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';

@ObjectType()
@Entity({ name: "lists" })
export class List {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column({
    type: "varchar",
    length: 50
  })

  @Field(() => String, { nullable: false})
  name: string;

  @ManyToOne(() => User, user => user.lists, { nullable: false, lazy: true})
  @Index('userId-list-index')
  @Field(() => User)
  user: User;
}
