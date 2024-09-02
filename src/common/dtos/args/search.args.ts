import { Field, ArgsType } from '@nestjs/graphql';
import { IsOptional, IsString } from "class-validator";
import { PaginationArgs } from './pagination.args';

@ArgsType()
export class SearchArgs {

    @IsOptional()
    @IsString()
    @Field(() => String, { name: "search", description: "término de busqueda", nullable: true })
    search?: string;
}