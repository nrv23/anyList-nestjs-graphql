import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsOptional, IsPositive, Min } from "class-validator";

@ArgsType()
export class PaginationArgs {

    @IsOptional()
    @Min(0)
    @Field(() => Int, { name: "offset", description: "De cual numero de registro empieza a obtener", nullable: true })
    offset: number = 0;

    @IsOptional()
    @IsPositive()
    @Min(1)
    @Field(() => Int, { name: "limit", description: "número de registros que va obtener ", nullable: true })
    limit: number = 10;
}