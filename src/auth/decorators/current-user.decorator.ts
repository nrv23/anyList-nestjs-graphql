import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";


export const CurrentUserDecorator = createParamDecorator(
    ( roles = [], context: ExecutionContext ) => {

    const ctx = GqlExecutionContext.create(context);
    // leer el usuario almacenado en la request 
    const user = ctx.getContext().req.user;

    if(!user) throw new InternalServerErrorException("No user inside a request");
    return user;

})