import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { List } from '../../list/entities/list.entity';

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


  @ManyToOne(() => User, user => user.lastUpdatedBy, { nullable: true , lazy: true})
  @JoinColumn({ name: "lastUpdatedBy " }) // cargar la informacion de la relacion 
  @Field(() => User, { nullable: true})
  lastUpdatedBy?: User

  @OneToMany(() => Item, items => items.user,{ lazy: true})
  //@Field(() => [Item]) si este decorador se quita, graphql no puede interpretar que esta propiedad 
  // existe en la entidad
  items: Item[];

  @OneToMany(() => List, list => list.user)
  lists: List[];
}
