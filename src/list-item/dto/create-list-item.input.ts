import { InputType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';


@InputType()
export class CreateListItemInput {

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity: number = 0;

  @IsString()
  @IsUUID()
  @Field(() => ID, { nullable: false})
  listId: string;

  @IsString()
  @IsUUID()
  @Field(() => ID, { nullable: false})
  itemId: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  completed: boolean = false;
}
