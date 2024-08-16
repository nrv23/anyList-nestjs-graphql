import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./../../../users/entities/user.entity";


@ObjectType() // puedo usar clases con este decorador para indicarle a graphql 
// en los querys y resolvers el tipo de dato que va devolver 
export class AuthResponseType {

    @Field(() => String)
    token: string;

    @Field(() => User)
    user: User
}