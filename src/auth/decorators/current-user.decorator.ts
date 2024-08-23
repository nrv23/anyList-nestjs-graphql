import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ValidRoles } from "../enums/valid-roles.enum";
import { User } from "../../users/entities/user.entity";


export const CurrentUserDecorator = createParamDecorator(
    ( roles: ValidRoles[] = [], context: ExecutionContext ) => {
        // leer los parametros del parentesis del decorador 
    console.log({roles})
    const ctx = GqlExecutionContext.create(context);
    // leer el usuario almacenado en la request 
    const user: User = ctx.getContext().req.user;
    let hasAValidRole: boolean = false;
        
    console.log({userRoles: user.roles})

    if(!user) throw new InternalServerErrorException("No user inside a request");
    if(!user.isActive) throw new ForbiddenException("User inactive");
    if(!roles.length) return user;
    
    for (const role of user.roles) {
        if(roles.includes(role)) hasAValidRole = true;
    }

    if(hasAValidRole) return user;
    throw new ForbiddenException("Not permitted");
})