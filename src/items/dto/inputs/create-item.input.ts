import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(() => String)
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @Field(() => String, { nullable: true })
  quantityUnits?: string;
}
