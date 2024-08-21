import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
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
    type: "text",
    array: true,
    default: ["user"]
  })
  roles: ValidRoles[];

  @Field(() => Boolean)
  @Column('boolean', { default: true })
  isActive: boolean;

}
