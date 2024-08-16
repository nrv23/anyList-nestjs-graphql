import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "users" })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID del usuario' })
  id: string;

  @Field(() => String)
  @Column({
    type: "varchar",
    length: 50
  })
  fullName: string;

  @Field(() => String)
  @Column({
    type: "varchar",
    length: 150,
    unique: true
  })
  email: string;

  //@Field(() => String)
  @Column({
    type: "varchar",
    length: 200
  })
  password: string;

  @Field(() => [String])
  @Column({
    type: "varchar",
    array: true,
    default: ["user"]
  })
  roles: string[];

  @Field(() => Boolean)
  @Column('boolean', { default: true })
  isActive: boolean;

}
