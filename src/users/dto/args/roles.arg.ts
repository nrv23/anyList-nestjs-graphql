import { IsArray } from "class-validator";
import { ValidRoles } from "../../../auth/enums/valid-roles.enum";
import { ArgsType, Field, registerEnumType } from "@nestjs/graphql";


@ArgsType()
export class ValidRolesArgs {

    @Field(() =>[ValidRoles], { nullable: true, description: "Roles de usuario"})
    @IsArray()
    roles: ValidRoles [] = [];
}

// registrar enum en graphql
// para poder tener argumentos personalizados en los queries de graphQL
registerEnumType(ValidRoles, {
    name: "ValidRoles"
});