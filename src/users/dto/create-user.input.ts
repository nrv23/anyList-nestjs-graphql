import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, MaxLength, IsEmail, MinLength, Matches } from 'class-validator';

@InputType()
export class CreateUserInput {

  @IsString()
  @MaxLength(150)
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsString()
  @MaxLength(15)
  @MinLength(8)
  @Matches(/^[a-zA-Z0-9_]+$/,{
      message: "La contraseña no cumple con el formato"
  })
  @Field(() => String)
  password: string;

  @IsString()
  @MaxLength(100)
  @MinLength(3)
  @Field(() => String)
  fullName: string;
}
